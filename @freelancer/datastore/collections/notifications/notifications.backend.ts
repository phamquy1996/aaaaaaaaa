import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { NotificationsCollection } from './notifications.types';

export function notificationsBackend(): Backend<NotificationsCollection> {
  return {
    defaultOrder: {
      field: 'time',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `newsfeed/0.1/newsfeed/notifications`,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
