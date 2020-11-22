import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { BidBuyerProjectFeesCollection } from './bid-buyer-project-fees.types';

export function bidBuyerProjectFeesBackend(): Backend<
  BidBuyerProjectFeesCollection
> {
  return {
    defaultOrder: {
      field: 'submitDate',
      direction: OrderByDirection.DESC,
    }, // FIXME: T50040 This uses `first_submitdate` which is not returned
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/bids`,
      params: {
        bids: ids || [],
        buyer_project_fee: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
