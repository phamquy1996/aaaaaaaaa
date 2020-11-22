import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { AccountProgressCollection } from './account-progress.types';

export function accountProgressBackend(): Backend<AccountProgressCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'dashboard/get-account-progress.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
