import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserInfoCollection } from './user-info.types';

export function userInfoBackend(): Backend<UserInfoCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This is only ever for the current user so ordering doesn't matter.
    fetch: (authUid, ids, query, order) => ({
      endpoint: `navigation/user-info.php`,
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
