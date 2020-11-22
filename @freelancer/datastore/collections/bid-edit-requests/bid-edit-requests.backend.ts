import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { BidEditRequestStatusApi } from 'api-typings/projects/projects';
import { BidEditRequestAction } from './bid-edit-requests.backend-model';
import { BidEditRequestsCollection } from './bid-edit-requests.types';

export function bidEditRequestsBackend(): Backend<BidEditRequestsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      const bidId = getQueryParamValue(query, 'bidId');

      return {
        endpoint: `projects/0.1/bids/${bidId}/bid_edit_requests/`,
        params: {
          statuses: getQueryParamValue(query, 'status'),
          bid_edit_request_ids: ids,
        },
      };
    },
    push: (_, bidEditRequest, extra) => {
      const { bidId } = bidEditRequest;

      return {
        endpoint: `projects/0.1/bids/${bidId}/bid_edit_requests/`,
        payload: {
          bid_id: bidId,
          new_amount: bidEditRequest.newAmount,
          new_period: bidEditRequest.newPeriod,
          comment: bidEditRequest.comment,
        },
      };
    },
    set: undefined,
    update: (_, bidEditRequest, originalBidEditRequest) => {
      const endpoint = `projects/0.1/bids/${originalBidEditRequest.bidId}/bid_edit_requests/${originalBidEditRequest.id}/`;
      const method = 'PUT';
      let action: BidEditRequestAction;

      if (bidEditRequest.status === BidEditRequestStatusApi.ACCEPTED) {
        action = BidEditRequestAction.ACCEPT;
      } else if (bidEditRequest.status === BidEditRequestStatusApi.DECLINED) {
        action = BidEditRequestAction.DECLINE;
      } else {
        throw new Error(
          'Please provide an action either accept or decline on a bid edit request!',
        );
      }

      return {
        endpoint,
        method,
        asFormData: false,
        payload: {
          action,
        },
      };
    },
    remove: undefined,
  };
}
