import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { NextPreviousUsersCollection } from './next-previous-users.types';

export function nextPreviousUsersBackend(): Backend<
  NextPreviousUsersCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'user-profile/nextPreviousUsers.php',
      isGaf: true,
      params: {
        userIds: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
