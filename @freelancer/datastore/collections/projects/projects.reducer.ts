import {
  CollectionActions,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  pluckDocumentFromRawStoreCollectionState,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { FrontendProjectStatusApi } from 'api-typings/common/common';
import {
  BidAwardStatusApi,
  BidCompleteStatusApi,
} from 'api-typings/projects/projects';
import { AWARD_EXPIRY_INTERVAL } from '../bids/bids.model';
import { BidsCollection } from '../bids/bids.types';
import { ProjectViewBidsCollection } from '../project-view-bids/project-view-bids.types';
import { transformProject } from './projects.transformers';
import { ProjectsCollection } from './projects.types';

export function projectsReducer(
  state = {},
  action:
    | CollectionActions<ProjectsCollection>
    | CollectionActions<BidsCollection>
    | CollectionActions<ProjectViewBidsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projects') {
        const { result, ref, order } = action.payload;
        if (result.projects) {
          return mergeDocuments<ProjectsCollection>(
            state,
            transformIntoDocuments(
              result.projects,
              transformProject,
              result.selected_bids,
            ),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'projects') {
        const { delta, originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<ProjectsCollection>(
          state,
          transformIntoDocuments(
            [originalDocument.id.toString()],
            projectId => {
              const project = pluckDocumentFromRawStoreCollectionState(
                state,
                ref.path,
                projectId,
              );
              if (!project) {
                throw new Error(
                  'Project being updated is missing in the store',
                );
              }

              return deepSpread(project, delta);
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
        const ref: Reference<ProjectsCollection> = {
          path: {
            collection: 'projects',
            authUid: action.payload.ref.path.authUid,
          },
        };
        // Update project collection when award bid
        if (delta.awardStatus === BidAwardStatusApi.PENDING) {
          const awardExpireTime = Date.now() + AWARD_EXPIRY_INTERVAL;

          // Adds the awarded bid regardless of whether it already exists
          // This avoids having to implicitly assume that the `award`
          // websocket message arrives before the bid update
          return updateWebsocketDocuments<ProjectsCollection>(
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
          return updateWebsocketDocuments<ProjectsCollection>(
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
          return updateWebsocketDocuments<ProjectsCollection>(
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
        return state;
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'projects') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<ProjectsCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }
    default: {
      return state;
    }
  }
}
