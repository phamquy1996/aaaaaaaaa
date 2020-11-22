import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { TaxCollection } from './tax.types';

export function taxBackend(): Backend<TaxCollection> {
  return {
    defaultOrder: {
      field: 'name',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'payments/0.1/tax',
      isGaf: false,
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
