import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserDepositMethodsCollection } from './user-deposit-methods.types';

export function userDepositMethodsBackend(): Backend<
  UserDepositMethodsCollection
> {
  return {
    defaultOrder: {
      field: 'renderingPriority',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/self',
      params: { deposit_methods: 'true' },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
