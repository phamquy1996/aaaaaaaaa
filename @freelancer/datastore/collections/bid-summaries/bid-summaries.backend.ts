import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { BidSummariesCollection } from './bid-summaries.types';

export function bidSummariesBackend(): Backend<BidSummariesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    // See T130898
    maxBatchSize: 1, // This endpoint only supports querying one document at a time.

    fetch: (authUid, ids = [], query) => {
      if (ids.length > 1) {
        throw new Error(`Cannot query more than one bid id per call`);
      }
      return {
        endpoint: `projects/0.1/bids/${ids[0]}/bid_summaries`,
        isGaf: false,
        params: {},
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
