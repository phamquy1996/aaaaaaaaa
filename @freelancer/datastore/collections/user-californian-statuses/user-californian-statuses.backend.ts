import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserCalifornianStatusesCollection } from './user-californian-statuses.types';

export function userCalifornianStatusesBackend(): Backend<
  UserCalifornianStatusesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'user/isUserPotentiallyCalifornian.php',
      isGaf: true,
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
