import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserRequiresGdprCollection } from './user-requires-gdpr.types';

export function userRequiresGdprBackend(): Backend<UserRequiresGdprCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'gdpr/userRequiresGdpr.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
