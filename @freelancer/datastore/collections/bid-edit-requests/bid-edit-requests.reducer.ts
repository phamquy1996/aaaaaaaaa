import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { BidEditRequestStatusApi } from 'api-typings/projects/projects';
import {
  transformBidEditRequest,
  transformWebsocketBidEditRequest,
} from './bid-edit-requests.transformers';
import { BidEditRequestsCollection } from './bid-edit-requests.types';

export function bidEditRequestsReducer(
  state: CollectionStateSlice<BidEditRequestsCollection> = {},
  action: CollectionActions<BidEditRequestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'bidEditRequests') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BidEditRequestsCollection>(
          state,
          transformIntoDocuments(
            result.bid_edit_requests,
            transformBidEditRequest,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'bidEditRequests') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<BidEditRequestsCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformBidEditRequest,
            ref.path.authUid,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'bidEditRequests') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments(
          state,
          transformIntoDocuments(
            [result],
            transformBidEditRequest,
            ref.path.authUid,
          ),
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const ref: Reference<BidEditRequestsCollection> = {
        path: {
          collection: 'bidEditRequests',
          authUid: action.payload.toUserId,
        },
      };
      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'editAwardedBidAccepted': {
            const { id, responseTime } = action.payload.data.editBidDetails;

            return updateWebsocketDocuments<BidEditRequestsCollection>(
              state,
              [toNumber(id)],
              bidEditRequest => ({
                ...bidEditRequest,
                status: BidEditRequestStatusApi.ACCEPTED,
                timeResponded:
                  responseTime && !bidEditRequest.timeResponded
                    ? responseTime * 1000
                    : bidEditRequest.timeResponded,
              }),
              ref,
            );
          }
          case 'editAwardedBidDeclined': {
            const { id, responseTime } = action.payload.data.editBidDetails;

            return updateWebsocketDocuments<BidEditRequestsCollection>(
              state,
              [toNumber(id)],
              bidEditRequest => ({
                ...bidEditRequest,
                status: BidEditRequestStatusApi.DECLINED,
                timeResponded:
                  responseTime && !bidEditRequest.timeResponded
                    ? responseTime * 1000
                    : bidEditRequest.timeResponded,
              }),
              ref,
            );
          }
          case 'editAwardedBidRequest': {
            return addWebsocketDocuments(
              state,
              [action.payload],
              transformWebsocketBidEditRequest,
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
