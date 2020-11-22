import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { NotificationsPreferencesCollection } from './notifications-preferences.types';

export function notificationsPreferencesBackend(): Backend<
  NotificationsPreferencesCollection
> {
  return {
    defaultOrder: {
      field: 'order',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `notifications/preferences.php`,
      isGaf: true,
    }),
    push: undefined,
    set: (_, notificationPreference) => ({
      endpoint: `notifications/preferences.php`,
      isGaf: true,
      asFormData: true,
      payload: {
        settings: JSON.stringify([notificationPreference]),
      },
    }),
    update: undefined,
    remove: undefined,
  };
}
