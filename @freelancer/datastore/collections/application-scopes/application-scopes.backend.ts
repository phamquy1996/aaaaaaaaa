import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ApplicationScopesCollection } from './application-scopes.types';

export function applicationScopesBackend(): Backend<
  ApplicationScopesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/developer_applications_scopes',
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
