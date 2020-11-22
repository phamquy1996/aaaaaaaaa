import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import {
  BidAwardStatusApi,
  BidCompleteStatusApi,
  BidEditRequestStatusApi,
} from 'api-typings/projects/projects';
import { BidEditRequestsCollection } from '../bid-edit-requests/bid-edit-requests.types';
import { ProjectViewBidsCollection } from '../project-view-bids/project-view-bids.types';
import { transformBid, transformWebsocketBidEvent } from './bids.transformers';
import { BidsCollection } from './bids.types';

export function bidsReducer(
  state: CollectionStateSlice<BidsCollection> = {},
  action:
    | CollectionActions<BidsCollection>
    | CollectionActions<ProjectViewBidsCollection>
    | CollectionActions<BidEditRequestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'bids') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BidsCollection>(
          state,
          transformIntoDocuments(result.bids, transformBid),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (
        action.payload.type === 'projectViewBids' ||
        action.payload.type === 'bids'
      ) {
        const { delta, originalDocument } = action.payload;
        const ref: Reference<BidsCollection> = {
          path: {
            collection: 'bids',
            authUid: action.payload.ref.path.authUid,
          },
        };

        return updateWebsocketDocuments<BidsCollection>(
          state,
          [originalDocument.id],
          bid => deepSpread(bid, delta),
          ref,
        );
      }
      // Update the bid object when bid edit request get updated
      if (action.payload.type === 'bidEditRequests') {
        const { delta, result } = action.payload;
        const ref: Reference<BidsCollection> = {
          path: {
            collection: 'bids',
            authUid: action.payload.ref.path.authUid,
          },
        };
        let newAmount: number;
        let newPeriod: number;

        if (delta.status === BidEditRequestStatusApi.ACCEPTED) {
          newAmount = result.new_amount;
          newPeriod = result.new_period;
        } else {
          newAmount = result.old_amount;
          newPeriod = result.old_period;
        }

        return updateWebsocketDocuments<BidsCollection>(
          state,
          [result.bid_id],
          bid => ({ ...bid, amount: newAmount, period: newPeriod }),
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (
        action.payload.type === 'projectViewBids' ||
        action.payload.type === 'bids'
      ) {
        const { result: rawBid } = action.payload;
        const ref: Reference<BidsCollection> = {
          path: {
            collection: 'bids',
            authUid: action.payload.ref.path.authUid,
          },
        };
        return mergeWebsocketDocuments<BidsCollection>(
          state,
          transformIntoDocuments([rawBid], transformBid),
          ref,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      const ref: Reference<BidsCollection> = {
        path: { collection: 'bids', authUid: action.payload.toUserId },
      };
      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'bid':
            return addWebsocketDocuments(
              state,
              [action.payload],
              transformWebsocketBidEvent,
              ref,
            );
          case 'bid_self':
          case 'bid_updated': {
            const id = toNumber(action.payload.data.id);
            return updateWebsocketDocuments<BidsCollection>(
              state,
              [id],
              bid => ({
                ...bid,
                id,
                bidderId: toNumber(action.payload.data.userId),
                projectId: toNumber(action.payload.data.projectId),
                amount: toNumber(action.payload.data.amount),
                period: toNumber(action.payload.data.period),
                description: action.payload.data.bid.descr || '',
                score: toNumber(action.payload.data.bid.score),
                submitDate: toNumber(action.payload.data.time) * 1000,
                timeSubmitted: toNumber(action.payload.data.time) * 1000,
              }),
              ref,
            );
          }

          case 'bidretracted': {
            return removeDocumentById<BidsCollection>(
              ref,
              state,
              action.payload.data.bid_id,
            );
          }

          case 'revoked': {
            const { apiMessage } = action.payload.data;
            const { id } = apiMessage.bid;
            return updateWebsocketDocuments<BidsCollection>(
              state,
              [id],
              bid => ({
                ...bid,
                id,
                bidderId: apiMessage.bid.bidder_id,
                projectId: apiMessage.project.id,
                awardStatus: apiMessage.bid.award_status,
              }),
              ref,
            );
          }

          case 'accepted': {
            const { apiMessage } = action.payload.data;
            const { id } = apiMessage.bid;
            return updateWebsocketDocuments<BidsCollection>(
              state,
              [id],
              bid => ({
                ...bid,
                id,
                bidderId: apiMessage.bid.bidder_id,
                projectId: apiMessage.project.id,
                ...(apiMessage.bid.amount
                  ? { amount: apiMessage.bid.amount }
                  : {}),
                retracted: action.payload.data.bid.retracted,
                period: apiMessage.bid.period,
                awardStatus: apiMessage.bid.award_status,
                sponsored: action.payload.data.bid.sponsored,
              }),
              ref,
            );
          }

          case 'denyed': {
            const { apiMessage } = action.payload.data;
            const id = toNumber(action.payload.data.bidId);
            const awardStatus = BidAwardStatusApi.REJECTED;
            return updateWebsocketDocuments<BidsCollection>(
              state,
              [id],
              bid => ({
                ...bid,
                id: toNumber(action.payload.data.bidId),
                bidderId: apiMessage.bid.bidder_id,
                projectId: apiMessage.project.id,
                awardStatus,
              }),
              ref,
            );
          }

          case 'award': {
            const { apiMessage, acceptByTime } = action.payload.data;
            const { id } = apiMessage.bid;
            return updateWebsocketDocuments<BidsCollection>(
              state,
              [id],
              bid => ({
                ...bid,
                id,
                bidderId: apiMessage.bid.bidder_id,
                projectId: apiMessage.project.id,
                amount: apiMessage.bid.amount,
                period: apiMessage.bid.period,
                awardStatus: apiMessage.bid.award_status,
                awardExpireTime: acceptByTime && acceptByTime * 1000,
              }),
              ref,
            );
          }

          case 'completed': {
            const { bidId } = action.payload.data;
            if (!bidId) {
              return state;
            }
            // You can also add bid.frontend_bid_status and paid_status changes
            // in the spread based on your need
            return updateWebsocketDocuments<BidsCollection>(
              state,
              [toNumber(bidId)],
              bid => ({
                ...bid,
                completeStatus: BidCompleteStatusApi.COMPLETE,
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

            return updateWebsocketDocuments<BidsCollection>(
              state,
              [toNumber(bidID)],
              bid => ({
                ...bid,
                amount: newAmount,
                period: newPeriod,
              }),
              ref,
            );
          }

          case 'sponsor_bid': {
            const { id, sum } = action.payload.data.object.bid;
            return updateWebsocketDocuments<BidsCollection>(
              state,
              [toNumber(id)],
              bid => ({
                ...bid,
                sponsored: toNumber(sum),
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
