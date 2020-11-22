import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserIsArrowWhitelistedCollection } from './user-is-arrow-whitelisted.types';

export function userIsArrowWhitelistedBackend(): Backend<
  UserIsArrowWhitelistedCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'enterprise/arrow-whitelist.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
