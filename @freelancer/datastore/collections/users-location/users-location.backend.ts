import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UsersLocationCollection } from './users-location.types';

export function usersLocationBackend(): Backend<UsersLocationCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'users/0.1/users',
      isGaf: false,
      params: {
        country_details: 'true',
        users: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
