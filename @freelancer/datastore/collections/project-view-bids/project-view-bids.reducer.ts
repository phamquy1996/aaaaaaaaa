import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  Documents,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import {
  BidApi,
  BidAwardStatusApi,
  BidCompleteStatusApi,
  BidEditRequestStatusApi,
  BidRatingApi,
} from 'api-typings/projects/projects';
import { BidEditRequestsCollection } from '../bid-edit-requests/bid-edit-requests.types';
import { RECOMMENDED_CUTOFF } from '../bids/bids.backend-model';
import { BidRating } from '../bids/bids.model';
import { transformWebsocketBidEvent } from '../bids/bids.transformers';
import { BidsCollection } from '../bids/bids.types';
import { ProjectViewBid } from './project-view-bids.model';
import { transformProjectViewBids } from './project-view-bids.transformers';
import { ProjectViewBidsCollection } from './project-view-bids.types';

export function projectViewBidsReducer(
  state: CollectionStateSlice<ProjectViewBidsCollection> = {},
  action:
    | CollectionActions<ProjectViewBidsCollection>
    | CollectionActions<BidsCollection>
    | CollectionActions<BidEditRequestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectViewBids') {
        const { result, ref, order } = action.payload;
        let recommendedBid;
        // Recommended Bid is the bid with the highest score in the project
        // The score needs to be larger than 0.85
        if (result.bids) {
          const unhiddenBids = result.bids.filter(bid => !bid.hidden);

          const highestScoreBid = unhiddenBids.reduce(
            (pre, cur) => ((pre.score ?? 0) > (cur.score ?? 0) ? pre : cur),
            { id: 0, score: 0 } as BidApi,
          );

          if ((highestScoreBid.score ?? 0) > RECOMMENDED_CUTOFF) {
            recommendedBid = highestScoreBid;
          }
        }

        return mergeDocuments<ProjectViewBidsCollection>(
          state,
          transformIntoDocuments(
            result.bids,
            transformProjectViewBids,
            recommendedBid,
          ),
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
        const { delta, originalDocument, result } = action.payload;
        const ref: Reference<ProjectViewBidsCollection> = {
          path: {
            collection: 'projectViewBids',
            authUid: action.payload.ref.path.authUid,
          },
        };

        /**
         * If we're creating a bid rating for the first time we can't simply
         * merge in the delta, we need to add in the `id` from the response.
         */
        if (!originalDocument.rating && !!delta.rating) {
          return updateWebsocketDocuments<ProjectViewBidsCollection>(
            state,
            [originalDocument.id],
            bid => ({
              ...bid,
              rating: {
                id: (result as BidRatingApi).id, // T191074
                ...(delta.rating as Omit<BidRating, 'id'>), // The type of `deepSpread` glosses of the issues of merging in a `Partial` object over an optional field.
              },
            }),
            ref,
          );
        }

        return updateWebsocketDocuments<ProjectViewBidsCollection>(
          state,
          [originalDocument.id],
          bid => deepSpread<ProjectViewBid>(bid, delta),
          ref,
        );
      }

      // Update the bid object when bid edit request get updated
      if (action.payload.type === 'bidEditRequests') {
        const { delta, result } = action.payload;
        const ref: Reference<ProjectViewBidsCollection> = {
          path: {
            collection: 'projectViewBids',
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

        return updateWebsocketDocuments<ProjectViewBidsCollection>(
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
        const { authUid } = action.payload.ref.path;
        const storeSlice = state[authUid];
        const { result } = action.payload;
        const ref: Reference<ProjectViewBidsCollection> = {
          path: {
            collection: 'projectViewBids',
            authUid,
          },
        };

        if (!storeSlice) {
          return mergeWebsocketDocuments<ProjectViewBidsCollection>(
            state,
            transformIntoDocuments([result], transformProjectViewBids),
            ref,
          );
        }

        return mergeWebsocketDocuments<ProjectViewBidsCollection>(
          state,
          transformIntoDocuments(
            mergeScoreAndRecommendedField(storeSlice.documents, [result]),
            transformProjectViewBids,
          ),
          ref,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      const ref: Reference<ProjectViewBidsCollection> = {
        path: {
          collection: 'projectViewBids',
          authUid: action.payload.toUserId,
        },
      };
      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'bid': {
            const storeSlice = state[ref.path.authUid];
            if (!storeSlice) {
              return state;
            }

            const { bid } = action.payload.data;
            const score =
              typeof bid.score === 'number'
                ? bid.score
                : Number.NEGATIVE_INFINITY;
            let recommended = false;
            let newState = state;

            // If new bid's score can be elected as recommended
            if (score > RECOMMENDED_CUTOFF) {
              const originalRecommendedBid = Object.values(
                storeSlice.documents,
              ).find(bidDocument => bidDocument.rawDocument.recommended);

              // If there isn't a recommended bid, or the old recommended bid's score is less than current one
              if (!originalRecommendedBid) {
                recommended = true;
              } else if (score > originalRecommendedBid.rawDocument.score) {
                // Modify old state
                newState = updateWebsocketDocuments<ProjectViewBidsCollection>(
                  newState,
                  [originalRecommendedBid.rawDocument.id],
                  projectViewBid => ({ ...projectViewBid, recommended: false }),
                  ref,
                );
                recommended = true;
              }
            }

            return addWebsocketDocuments(
              newState,
              [action.payload],
              event => ({
                ...transformWebsocketBidEvent(event),
                score,
                recommended,
              }),
              ref,
            );
          }
          case 'bid_self':
          case 'bid_updated': {
            const id = toNumber(action.payload.data.id);
            return updateWebsocketDocuments<ProjectViewBidsCollection>(
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
              }),
              ref,
            );
          }

          case 'bidretracted': {
            return removeDocumentById<ProjectViewBidsCollection>(
              ref,
              state,
              action.payload.data.bid_id,
            );
          }

          case 'revoked': {
            const { apiMessage } = action.payload.data;
            const { id } = apiMessage.bid;
            return updateWebsocketDocuments<ProjectViewBidsCollection>(
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
            return updateWebsocketDocuments<ProjectViewBidsCollection>(
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
            return updateWebsocketDocuments<ProjectViewBidsCollection>(
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
            return updateWebsocketDocuments<ProjectViewBidsCollection>(
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
            return updateWebsocketDocuments<ProjectViewBidsCollection>(
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

            return updateWebsocketDocuments<ProjectViewBidsCollection>(
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
            return updateWebsocketDocuments<ProjectViewBidsCollection>(
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

function mergeScoreAndRecommendedField(
  projectBidDocuments: Documents<ProjectViewBid>,
  resultBids: ReadonlyArray<BidApi>,
): ReadonlyArray<BidApi> {
  return resultBids.map(bid => {
    const originalBidDocument = Object.values(projectBidDocuments).find(
      a => a.rawDocument.id === bid.id,
    );
    if (!originalBidDocument) {
      return bid;
    }
    // If there is a bid document in the state store,
    // Merge the original two fields to the result.bids even original is undefined
    // Because here, push success will never return score or recommended field on current API
    const originalScore = originalBidDocument.rawDocument.score;
    const originalRecommendedField =
      originalBidDocument.rawDocument.recommended;
    return {
      ...bid,
      score: originalScore,
      recommended: originalRecommendedField,
    };
  });
}
