import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { transformBidSummary } from './bid-summaries.transformers';
import { BidSummariesCollection } from './bid-summaries.types';

export function bidSummariesReducer(
  state: CollectionStateSlice<BidSummariesCollection> = {},
  action: CollectionActions<BidSummariesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'bidSummaries') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BidSummariesCollection>(
          state,
          // TODO: When we have a batched bid summaries endpoint, result.bid_summaries
          // will be a map from bid ids to BidSummary objects. Pass in result.bid_summaries
          // instead.
          // See T130898
          transformIntoDocuments([result], transformBidSummary),
          order,
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const ref: Reference<BidSummariesCollection> = {
        path: {
          collection: 'bidSummaries',
          authUid: action.payload.toUserId,
        },
      };
      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'bidHourlyCurrentCycleSummaryUpdate':
            return updateWebsocketDocuments<BidSummariesCollection>(
              state,
              [toNumber(action.payload.data.bidId)],
              bidSummary => ({
                ...bidSummary,
                currentHourlyCycleSummary: bidSummary.currentHourlyCycleSummary
                  ? {
                      ...bidSummary.currentHourlyCycleSummary,
                      totalTrackedTimeInCycle:
                        action.payload.data.totalTrackedTime,
                      uninvoicedTrackedTimeInCycle:
                        action.payload.data.totalUninvoicedTime,
                    }
                  : undefined,
              }),
              ref,
            );

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
