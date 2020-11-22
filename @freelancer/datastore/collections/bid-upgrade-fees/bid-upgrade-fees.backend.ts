import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { BidUpgradeFeesCollection } from './bid-upgrade-fees.types';

export function bidUpgradeFeesBackend(): Backend<BidUpgradeFeesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/0.1/bids/fees',
      params: {
        currencies: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
