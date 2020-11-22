import {
  addWebsocketDocuments,
  CollectionActions,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  Path,
  removeDocumentById,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { MilestoneStatusApi } from 'api-typings/projects/projects';
import {
  transformMilestone,
  transformWebsocketMilestone,
} from './milestones.transformers';
import { MilestonesCollection } from './milestones.types';

export function milestonesReducer(
  state = {},
  action: CollectionActions<MilestonesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'milestones') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MilestonesCollection>(
          state,
          transformIntoDocuments(result.milestones, transformMilestone),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'milestones') {
        const { delta, originalDocument, ref, result } = action.payload;

        // Release milestones
        if (delta.status === MilestoneStatusApi.CLEARED) {
          // if full milestone_release, no remaining_milestone in response
          const remainingMilestone = result
            ? result.remaining_milestone
            : undefined;
          if (remainingMilestone && remainingMilestone.transaction_id) {
            // this means we partially created a milestone
            // remove the original milestone, as it is now canceled and shouldn't be shown
            const cancelledMilestoneRemovedState = removeDocumentById<
              MilestonesCollection
            >(ref, state, originalDocument.id);

            // and create the new released milestone in place
            const releasedMilestone = result.released_milestone;
            const releasedMilestoneAddedState = addWebsocketDocuments(
              cancelledMilestoneRemovedState,
              [releasedMilestone],
              () =>
                transformMilestone({
                  ...releasedMilestone,
                }),
              ref,
            );

            // create new remainder milestone to show
            const remainingMilestoneAddedState = addWebsocketDocuments(
              releasedMilestoneAddedState,
              [remainingMilestone],
              () =>
                transformMilestone({
                  ...remainingMilestone,
                }),
              ref,
            );
            return remainingMilestoneAddedState;
          }
          // fully release milestone
          return updateWebsocketDocuments<MilestonesCollection>(
            state,
            [originalDocument.id],
            milestone =>
              deepSpread(
                milestone,
                transformMilestone({
                  ...result.original_milestone,
                }),
              ),
            ref,
          );
        }

        if (delta.status === MilestoneStatusApi.CANCELED) {
          return removeDocumentById<MilestonesCollection>(
            ref,
            state,
            originalDocument.id,
          );
        }

        const milestoneMergeState = updateWebsocketDocuments<
          MilestonesCollection
        >(
          state,
          [originalDocument.id],
          milestone => deepSpread(milestone, delta),
          ref,
        );
        return milestoneMergeState;
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'milestones') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<MilestonesCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformMilestone,
            ref.path.authUid,
          ),
          ref,
        );
      }
      // TODO - what do about any associated milestone request ? Just rely on websockets?
      return state;
    }
    case 'WS_MESSAGE': {
      const path: Path<MilestonesCollection> = {
        collection: 'milestones',
        authUid: action.payload.toUserId,
      };
      const ref = { path };

      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'cancelMilestone': {
            return removeDocumentById<MilestonesCollection>(
              ref,
              state,
              toNumber(action.payload.data.tranId),
            );
          }

          case 'rejectMilestoneCancellation': {
            return updateWebsocketDocuments(
              state,
              [action.payload.data.id],
              milestone => ({
                ...milestone,
                cancellationRequested: false,
                actionReason: undefined,
                actionReadonText: undefined,
                action: undefined,
              }),
              ref,
            );
          }

          case 'createMilestone': {
            const { newMilestone } = action.payload.data;
            return addWebsocketDocuments(
              state,
              [newMilestone],
              transformWebsocketMilestone,
              ref,
            );
          }

          case 'accepted': {
            const { milestoneIds } = action.payload.data;

            return updateWebsocketDocuments(
              state,
              milestoneIds,
              milestone => ({
                ...milestone,
                status: MilestoneStatusApi.FROZEN, // frozen after accept award
              }),
              ref,
            );
          }

          case 'releaseMilestone': {
            const { milestoneId } = action.payload.data;

            return updateWebsocketDocuments(
              state,
              [toNumber(milestoneId)],
              milestone => ({
                ...milestone,
                status: MilestoneStatusApi.CLEARED,
              }),
              ref,
            );
          }

          case 'milestoneStatusUpdate': {
            const { milestoneId, milestoneStatus } = action.payload.data;
            return updateWebsocketDocuments(
              state,
              [toNumber(milestoneId)],
              milestone => ({
                ...milestone,
                status: milestoneStatus,
              }),
              ref,
            );
          }

          case 'requestCancelMilestone': {
            const {
              milestoneId,
              actionReason,
              actionReasonText,
            } = action.payload.data;
            return updateWebsocketDocuments(
              state,
              [toNumber(milestoneId)],
              milestone => ({
                ...milestone,
                cancellationRequested: true,
                actionReason,
                actionReasonText,
              }),
              ref,
            );
          }

          case 'requestToRelease': {
            const { tranId } = action.payload.data;
            return updateWebsocketDocuments(
              state,
              [toNumber(tranId)],
              milestone => ({
                ...milestone,
                status: MilestoneStatusApi.REQUESTED_RELEASE,
              }),
              ref,
            );
          }

          case 'generateAutomaticMilestone': {
            return addWebsocketDocuments(
              state,
              [action.payload.data],
              transformWebsocketMilestone,
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
