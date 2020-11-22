import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ToastNotificationsCollection } from './toast-notifications.types';

export function toastNotificationsBackend(): Backend<
  ToastNotificationsCollection
> {
  return {
    // The backend sorts by submitDate but that's a string in NY time :(
    defaultOrder: {
      field: 'time',
      direction: OrderByDirection.DESC,
    },
    fetch: undefined,
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
