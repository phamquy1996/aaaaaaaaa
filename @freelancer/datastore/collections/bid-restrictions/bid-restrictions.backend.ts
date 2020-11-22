import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { BidRestrictionsCollection } from './bid-restrictions.types';

export function bidRestrictionsBackend(): Backend<BidRestrictionsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    maxBatchSize: 1, // This endpoint only supports querying one document at a time.

    fetch: (authUid, ids = [], query) => {
      if (ids.length !== 1) {
        throw Error('Bid Restrictions only supports single document queries');
      }

      return {
        endpoint: 'projects/freelancerCanBidOnProject.php',
        isGaf: true,
        params: {
          projectId: ids[0],
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
