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
import { MilestoneRequestStatusApi } from 'api-typings/projects/projects';
import { MilestoneRequestAction } from './milestone-requests.backend-model';
import {
  transformMilestoneRequest,
  transformMilestoneRequestWebsocketEvent,
} from './milestone-requests.transformers';
import { MilestoneRequestsCollection } from './milestone-requests.types';

export function milestoneRequestsReducer(
  state = {},
  action: CollectionActions<MilestoneRequestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'milestoneRequests') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MilestoneRequestsCollection>(
          state,
          transformIntoDocuments(
            result.milestone_requests,
            transformMilestoneRequest,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'milestoneRequests') {
        const { delta, originalDocument, ref } = action.payload;

        return updateWebsocketDocuments<MilestoneRequestsCollection>(
          state,
          [originalDocument.id],
          milestoneRequest =>
            delta.action === MilestoneRequestAction.REJECT
              ? deepSpread(milestoneRequest, {
                  ...delta,
                  status: MilestoneRequestStatusApi.REJECTED,
                })
              : deepSpread(milestoneRequest, delta),
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'milestoneRequests') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments<MilestoneRequestsCollection>(
          state,
          transformIntoDocuments([result], transformMilestoneRequest),
          ref,
        );
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'milestoneRequests') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<MilestoneRequestsCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      if (action.payload.parent_type === 'notifications') {
        const path: Path<MilestoneRequestsCollection> = {
          collection: 'milestoneRequests',
          authUid: action.payload.toUserId,
        };
        const ref = { path };

        switch (action.payload.type) {
          case 'requestMilestone': {
            return addWebsocketDocuments(
              state,
              [action.payload],
              transformMilestoneRequestWebsocketEvent,
              ref,
            );
          }

          case 'createMilestone': {
            const milestoneRequestId = toNumber(
              action.payload.data.created_milestone_request_id,
            );

            return milestoneRequestId
              ? updateWebsocketDocuments<MilestoneRequestsCollection>(
                  state,
                  [milestoneRequestId],
                  milestoneRequest => ({
                    ...milestoneRequest,
                    status: MilestoneRequestStatusApi.CREATED,
                  }),
                  ref,
                )
              : state;
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
