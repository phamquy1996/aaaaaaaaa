import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserPendingFundsCollection } from './user-pending-funds.types';

export function userPendingFundsBackend(): Backend<UserPendingFundsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // The backend does not not appear to order these.
    fetch: (authUid, ids, query, order) => ({
      endpoint: `users/0.1/self`,
      params: { balance_details: 1 },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
