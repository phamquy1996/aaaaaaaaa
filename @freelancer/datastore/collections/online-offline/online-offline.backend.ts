import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { OnlineOfflineCollection } from './online-offline.types';

export function onlineOfflineBackend(): Backend<OnlineOfflineCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: undefined,
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
    isSubscribable: true,
  };
}
