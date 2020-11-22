import {
  CollectionActions,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import {
  transformOnlineOfflineStatusChange,
  transformOnlineOfflineStatusFetch,
} from './online-offline.transformers';
import { OnlineOfflineCollection } from './online-offline.types';

export function onlineOfflineReducer(
  state = {},
  action: CollectionActions<OnlineOfflineCollection>,
) {
  switch (action.type) {
    case 'WS_MESSAGE':
      if (
        action.payload.parent_type === 'onlineoffline' &&
        action.payload.type === 'statusget'
      ) {
        const { toUserId, data } = action.payload;
        return mergeWebsocketDocuments<OnlineOfflineCollection>(
          state,
          transformIntoDocuments(
            Object.entries(data),
            transformOnlineOfflineStatusFetch,
          ),
          { path: { collection: 'onlineOffline', authUid: toUserId } },
        );
      }
      if (
        action.payload.parent_type === 'onlineoffline' &&
        action.payload.type === 'statuschange'
      ) {
        const { data, toUserId } = action.payload;
        return mergeWebsocketDocuments<OnlineOfflineCollection>(
          state,
          transformIntoDocuments([data], transformOnlineOfflineStatusChange),
          { path: { collection: 'onlineOffline', authUid: toUserId } },
        );
      }

      return state;

    default:
      return state;
  }
}
