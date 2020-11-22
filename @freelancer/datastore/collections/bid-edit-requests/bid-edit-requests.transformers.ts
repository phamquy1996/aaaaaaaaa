import {
  WebsocketEditAwardedBidAcceptedEvent,
  WebsocketEditAwardedBidCreatedEvent,
  WebsocketEditAwardedBidDeclinedEvent,
} from '@freelancer/datastore/core';
import { BidEditRequestApi } from 'api-typings/projects/projects';
import { BidEditRequest } from './bid-edit-requests.model';

export function transformBidEditRequest(
  bidEditRequest: BidEditRequestApi,
): BidEditRequest {
  return {
    id: bidEditRequest.id,
    bidId: bidEditRequest.bid_id,
    status: bidEditRequest.status,
    newAmount: bidEditRequest.new_amount,
    newPeriod: bidEditRequest.new_period,
    oldAmount: bidEditRequest.old_amount,
    oldPeriod: bidEditRequest.old_period,
    comment: bidEditRequest.comment,
    timeRequested: bidEditRequest.time_requested * 1000,
    timeResponded:
      bidEditRequest.time_responded && bidEditRequest.time_responded * 1000,
  };
}

export function transformWebsocketBidEditRequest(
  payload:
    | WebsocketEditAwardedBidAcceptedEvent
    | WebsocketEditAwardedBidCreatedEvent
    | WebsocketEditAwardedBidDeclinedEvent,
): BidEditRequest {
  const bidEditRequest = payload.data.editBidDetails;

  return {
    id: bidEditRequest.id,
    bidId: bidEditRequest.bidID,
    newAmount: bidEditRequest.newAmount,
    newPeriod: bidEditRequest.newPeriod,
    oldAmount: bidEditRequest.oldAmount,
    oldPeriod: bidEditRequest.oldPeriod,
    comment: bidEditRequest.comment,
    timeRequested: bidEditRequest.requestTime * 1000,
    timeResponded: bidEditRequest.responseTime
      ? bidEditRequest.responseTime * 1000
      : undefined,
    status: bidEditRequest.status,
  };
}
