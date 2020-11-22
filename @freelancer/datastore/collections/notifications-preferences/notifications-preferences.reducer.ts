import {
  CollectionActions,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformNotificationsPreferences } from './notifications-preferences.transforms';
import { NotificationsPreferencesCollection } from './notifications-preferences.types';

export function notificationsPreferencesReducer(
  state = {},
  action: CollectionActions<NotificationsPreferencesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'notificationsPreferences') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<NotificationsPreferencesCollection>(
          state,
          transformIntoDocuments(result, transformNotificationsPreferences),
          order,
          ref,
        );
      }
      return state;
    case 'API_SET_SUCCESS': {
      if (action.payload.type === 'notificationsPreferences') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<NotificationsPreferencesCollection>(
          state,
          transformIntoDocuments(result, transformNotificationsPreferences),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
