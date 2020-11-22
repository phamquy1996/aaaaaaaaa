import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserGiveGetDetailsCollection } from './user-give-get-details.types';

export function userGiveGetDetailsBackend(): Backend<
  UserGiveGetDetailsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'give-get/giveGetUser.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
