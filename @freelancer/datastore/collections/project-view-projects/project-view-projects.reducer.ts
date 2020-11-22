import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  pluckDocumentFromRawStoreCollectionState,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
  uniq,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { isDefined, toNumber } from '@freelancer/utils';
import { FrontendProjectStatusApi } from 'api-typings/common/common';
import {
  BidAwardStatusApi,
  BidCompleteStatusApi,
  ProjectStatusApi,
  ProjectSubStatusApi,
} from 'api-typings/projects/projects';
import { AWARD_EXPIRY_INTERVAL } from '../bids/bids.model';
import { transformWebsocketAcceptEvent } from '../bids/bids.transformers';
import { BidsCollection } from '../bids/bids.types';
import { transformCustomFieldValues } from '../custom-field-info-configurations/custom-field-info-configurations.transformers';
import { ProjectViewBidsCollection } from '../project-view-bids/project-view-bids.types';
import { ProjectsCollection } from '../projects/projects.types';
import {
  transformProjectViewProjects,
  transformProjectViewProjectsPush,
  transformProjectViewProjectsUpdate,
} from './project-view-projects.transformers';
import { ProjectViewProjectsCollection } from './project-view-projects.types';

export function projectViewProjectsReducer(
  state: CollectionStateSlice<ProjectViewProjectsCollection> = {},
  action:
    | CollectionActions<ProjectViewBidsCollection>
    | CollectionActions<ProjectViewProjectsCollection>
    | CollectionActions<ProjectsCollection>
    | CollectionActions<BidsCollection>,
) {
  switch (action.type) {
    // Network request fetched items successfully, merge them into the state
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectViewProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectViewProjectsCollection>(
          state,
          transformIntoDocuments(
            result.projects,
            transformProjectViewProjects,
            result.selected_bids,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'projectViewProjects') {
        const { ref, result } = action.payload;

        return mergeWebsocketDocuments<ProjectViewProjectsCollection>(
          state,
          transformIntoDocuments([result], transformProjectViewProjectsPush),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'projectViewProjects') {
        const {
          delta,
          originalDocument,
          ref,
          result,
          rawRequest,
        } = action.payload;
        return mergeWebsocketDocuments<ProjectViewProjectsCollection>(
          state,
          transformIntoDocuments(
            [originalDocument.id.toString()],
            projectId => {
              let project = pluckDocumentFromRawStoreCollectionState(
                state,
                ref.path,
                projectId,
              );
              if (!project) {
                throw new Error(
                  'Project being updated is missing in the store',
                );
              }

              // If the request includes opening a hire me project for bidding
              if ('to_nonhireme' in rawRequest && rawRequest.to_nonhireme) {
                project = {
                  ...project,
                  hireme: false,
                };
              }

              // Update project custom field values
              if (result && 'enterprise_metadata_values' in result) {
                const customFieldInfoConfigurationIds = uniq(
                  result.enterprise_metadata_values.map(
                    value => value.enterprise_metadata_field_id,
                  ),
                );
                // Remove all the customFieldValue with the same customFieldInfoConfigurationId as the result
                // because we will overwrite them
                const originalEnterpriseMetadataValues = project.customFieldValues
                  ? project.customFieldValues.filter(
                      value =>
                        !customFieldInfoConfigurationIds.includes(
                          value.customFieldInfoConfigurationId,
                        ),
                    )
                  : [];

                const newCustomFieldWithValue = result.enterprise_metadata_values
                  .filter(value => isDefined(value.value))
                  .map(value => transformCustomFieldValues(value));

                project = {
                  ...project,
                  customFieldValues: [
                    ...originalEnterpriseMetadataValues,
                    ...newCustomFieldWithValue,
                  ],
                };
              }
              return deepSpread(
                project,
                transformProjectViewProjectsUpdate(delta),
              );
            },
          ),
          ref,
        );
      }
      // Used for update project Object when updating a bid object
      // E.g. award bid, retract bid.
      // Although those behaviour can be forced by reload the page or whatever
      if (
        action.payload.type === 'projectViewBids' ||
        action.payload.type === 'bids'
      ) {
        const { delta, originalDocument } = action.payload;
        const ref: Reference<ProjectViewProjectsCollection> = {
          path: {
            collection: 'projectViewProjects',
            authUid: action.payload.ref.path.authUid,
          },
        };
        // Update project collection when award bid
        if (delta.awardStatus === BidAwardStatusApi.PENDING) {
          const awardExpireTime = Date.now() + AWARD_EXPIRY_INTERVAL;

          // Adds the awarded bid regardless of whether it already exists
          // This avoids having to implicitly assume that the `award`
          // websocket message arrives before the bid update
          return updateWebsocketDocuments<ProjectViewProjectsCollection>(
            state,
            [originalDocument.projectId],
            project => ({
              ...project,
              selectedBids: [
                ...project.selectedBids.filter(
                  // prevent duplicate
                  bid => bid.id !== originalDocument.id,
                ),
                deepSpread(originalDocument, { ...delta, awardExpireTime }),
              ],
            }),
            ref,
          );
        }
        // Update project collection when revoke bid
        if (delta.awardStatus === BidAwardStatusApi.REVOKED) {
          return updateWebsocketDocuments<ProjectViewProjectsCollection>(
            state,
            [originalDocument.projectId],
            project => ({
              ...project,
              selectedBids: project.selectedBids.filter(
                bid => bid.id !== originalDocument.id,
              ),
            }),
            ref,
          );
        }
        // Update project collection when ending a project on a certain bid
        if (
          delta.completeStatus === BidCompleteStatusApi.COMPLETE ||
          delta.completeStatus === BidCompleteStatusApi.INCOMPLETE
        ) {
          return updateWebsocketDocuments<ProjectViewProjectsCollection>(
            state,
            [originalDocument.projectId],
            project => {
              const selectedBids = project.selectedBids.map(bid =>
                bid.id === originalDocument.id
                  ? deepSpread(originalDocument, delta)
                  : bid,
              );

              // FIXME: T69699
              // Currently the backend actually sets the project as closed
              // when *any* bid is ended instead of only when all are.
              // const complete = selectedBids.every(
              //   bid => bid.completeStatus === BidCompleteStatusApi.COMPLETE,
              // );
              const complete = true;

              const frontendProjectStatus = complete
                ? FrontendProjectStatusApi.COMPLETE
                : project.frontendProjectStatus;

              return {
                ...project,
                selectedBids,
                frontendProjectStatus,
              };
            },
            ref,
          );
        }

        if (delta.isLocationTracked === true) {
          return updateWebsocketDocuments<ProjectViewProjectsCollection>(
            state,
            [originalDocument.projectId],
            project => ({
              ...project,
              selectedBids: [
                ...project.selectedBids.filter(
                  bid => bid.id !== originalDocument.id,
                ),
                deepSpread(originalDocument, { ...delta }),
              ],
            }),
            ref,
          );
        }
        return state;
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      const ref: Reference<ProjectViewProjectsCollection> = {
        path: {
          collection: 'projectViewProjects',
          authUid: action.payload.ref.path.authUid,
        },
      };
      if (action.payload.type === 'projects') {
        const { originalDocument } = action.payload;
        return removeDocumentById<ProjectViewProjectsCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      const ref: Reference<ProjectViewProjectsCollection> = {
        path: {
          collection: 'projectViewProjects',
          authUid: action.payload.toUserId,
        },
      };
      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'bid':
          case 'bid_self': {
            const { projectId, amount } = action.payload.data;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [toNumber(projectId)],
              project => ({
                ...project,
                bidStats: {
                  bidCount: project.bidStats.bidCount + 1,
                  bidAvg:
                    ((project.bidStats.bidAvg ? project.bidStats.bidAvg : 0) *
                      project.bidStats.bidCount +
                      toNumber(amount)) /
                    (project.bidStats.bidCount + 1),
                },
              }),
              ref,
            );
          }
          case 'bidretracted': {
            const {
              project_id: projectId,
              bid_amount: bidAmount,
            } = action.payload.data;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [projectId],
              project => ({
                ...project,
                bidStats: {
                  bidCount: project.bidStats.bidCount - 1,
                  bidAvg:
                    ((project.bidStats.bidAvg ? project.bidStats.bidAvg : 0) *
                      project.bidStats.bidCount -
                      bidAmount) /
                    (project.bidStats.bidCount - 1),
                },
              }),
              ref,
            );
          }
          case 'revoked': {
            const { projectId, bidId } = action.payload.data;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [projectId],
              project =>
                project.selectedBids.length === 1
                  ? {
                      ...project,
                      subStatus: undefined,
                      status: project.hireme
                        ? ProjectStatusApi.CLOSED
                        : ProjectStatusApi.ACTIVE,
                      selectedBids: [],
                    }
                  : {
                      ...project,
                      selectedBids: project.selectedBids.filter(
                        b => b.id !== toNumber(bidId),
                      ),
                    },
              ref,
            );
          }
          case 'award': {
            const { apiMessage, acceptByTime } = action.payload.data;
            const { id } = apiMessage.project;
            const { bid } = apiMessage;

            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [id],
              project => ({
                ...project,
                status: ProjectStatusApi.FROZEN,
                subStatus: ProjectSubStatusApi.FROZEN_AWARDED,
                selectedBids: [
                  ...project.selectedBids,
                  {
                    id: bid.id,
                    bidderId: bid.bidder_id,
                    amount: bid.amount,
                    period: bid.period,
                    awardStatus: BidAwardStatusApi.PENDING,
                    submitDate: Date.now(), // WS doesn't have this field, not very useful on FPVP payment tab anyway
                    projectId: id,
                    awardExpireTime: acceptByTime && acceptByTime * 1000,
                  },
                ],
              }),
              ref,
            );
          }
          case 'accepted': {
            const delta = transformWebsocketAcceptEvent(action.payload);
            const { id } = action.payload.data.apiMessage.project;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [id],
              project => ({
                ...project,
                selectedBids: project.selectedBids.map(bid =>
                  bid.id === delta.id ? { ...bid, ...delta } : bid,
                ),
              }),
              ref,
            );
          }
          case 'denyed': {
            const { id } = action.payload.data.apiMessage.project;
            const deniedBidderId = action.payload.data.apiMessage.bid.bidder_id;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [id],
              project =>
                project.selectedBids.length === 1
                  ? {
                      ...project,
                      subStatus: undefined,
                      status: project.hireme
                        ? ProjectStatusApi.FROZEN
                        : ProjectStatusApi.ACTIVE,
                      selectedBids: [],
                    }
                  : {
                      ...project,
                      selectedBids: project.selectedBids.filter(
                        b => b.bidderId !== deniedBidderId,
                      ),
                    },
              ref,
            );
          }
          // Mark the bid as completed, which will reflect on project-status-helper.service.ts
          // Using bidId because of multiaward
          case 'completed': {
            const { id, bidId } = action.payload.data;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [toNumber(id)],
              project => ({
                ...project,
                subStatus: ProjectSubStatusApi.CLOSED_AWARDED,
                // You can also add bid.frontend_bid_status and paid_status changes
                // in the spread based on your need
                selectedBids: project.selectedBids.map(bid =>
                  bid.id === bidId
                    ? { ...bid, completeStatus: BidCompleteStatusApi.COMPLETE }
                    : bid,
                ),
              }),
              ref,
            );
          }

          case 'editAwardedBidAccepted': {
            const {
              bidID,
              newAmount,
              newPeriod,
            } = action.payload.data.editBidDetails;
            const projectId = action.payload.data.id;

            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [toNumber(projectId)],
              project => {
                const originalBid = project.selectedBids.find(
                  b => b.id === bidID,
                );
                return originalBid
                  ? {
                      ...project,
                      selectedBids: [
                        ...project.selectedBids.filter(
                          b => b.id !== originalBid.id,
                        ),
                        {
                          ...originalBid,
                          amount: newAmount,
                          period: newPeriod,
                        },
                      ],
                    }
                  : project;
              },
              ref,
            );
          }

          case 'ipAgreementUpgrade': {
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [action.payload.data.projectId],
              project => ({
                ...project,
                upgrades: {
                  ...project.upgrades,
                  ipContract: true,
                },
              }),
              ref,
            );
          }

          case 'ndaUpgrade': {
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [action.payload.data.projectId],
              project => ({
                ...project,
                upgrades: {
                  ...project.upgrades,
                  NDA: true,
                },
              }),
              ref,
            );
          }

          case 'ndaSigned': {
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [action.payload.data.projectId],
              project => ({
                ...project,
                ndaDetails: {
                  signatures: [
                    ...project.ndaDetails.signatures,
                    {
                      projectId: action.payload.data.projectId,
                      timeSigned: toNumber(action.payload.data.time) * 1000,
                      userId: action.payload.data.userId,
                    },
                  ],
                },
              }),
              ref,
            );
          }

          case 'editProjectCollaboratorPermissions': {
            const collabData = action.payload.data;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [collabData.projectId],
              project => {
                const collaboration = project.projectCollaborations.find(
                  collab => collab.id === collabData.id,
                );

                if (!collaboration) {
                  return project;
                }

                const newCollab = [
                  {
                    ...collaboration,
                    permissions: collabData.permissions || [],
                  },
                ];

                return {
                  ...project,
                  projectCollaborations: [
                    ...project.projectCollaborations.filter(
                      collab => collab.id !== collabData.id,
                    ),
                    ...newCollab,
                  ],
                };
              },
              ref,
            );
          }

          case 'projectInviteToBid': {
            const { freelancerId, projectId } = action.payload.data;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [projectId],
              project => ({
                ...project,
                invitedFreelancers: [
                  freelancerId,
                  ...(project.invitedFreelancers || []),
                ],
              }),
              ref,
            );
          }

          case 'project': {
            const wsProject = action.payload.data;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [wsProject.id],
              project => ({
                ...project,
                upgrades: {
                  ...project.upgrades,
                  assisted: wsProject.recruiter,
                  featured: wsProject.featured,
                  fulltime: wsProject.fulltime,
                  nonpublic: wsProject.nonpublic,
                },
              }),
              ref,
            );
          }

          case 'projectStatusChange': {
            const projectStatusData = action.payload.data;

            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [projectStatusData.id],
              project => ({
                ...project,
                status: projectStatusData.newStatus.status,
                subStatus: projectStatusData.newStatus.subStatus || undefined,
              }),
              ref,
            );
          }

          case 'openHireMeForBidding': {
            const { projectId } = action.payload.data;
            return updateWebsocketDocuments<ProjectViewProjectsCollection>(
              state,
              [projectId],
              project => ({
                ...project,
                hireme: false,
              }),
              ref,
            );
          }

          default:
            return state;
        }
      }
      return state;
    }

    default:
      return state;
  }
}
