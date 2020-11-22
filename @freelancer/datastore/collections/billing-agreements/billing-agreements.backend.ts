import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { BillingAgreementsCollection } from './billing-agreements.types';

export function billingAgreementsBackend(): Backend<
  BillingAgreementsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'payments/0.1/authorizations',
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
