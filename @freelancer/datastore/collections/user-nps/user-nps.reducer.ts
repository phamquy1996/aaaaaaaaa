import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import {
  transformUserNps,
  transformWebSocketNps,
} from './user-nps.transformers';
import { UserNpsCollection } from './user-nps.types';

export function userNpsReducer(
  state: CollectionStateSlice<UserNpsCollection> = {},
  action: CollectionActions<UserNpsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userNps') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserNpsCollection>(
          state,
          transformIntoDocuments(result.net_promoter_scores, transformUserNps),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'userNps') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<UserNpsCollection>(
          state,
          transformIntoDocuments([result.net_promoter_score], transformUserNps),
          ref,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      const ref: Reference<UserNpsCollection> = {
        path: {
          collection: 'userNps',
          authUid: action.payload.toUserId,
        },
      };
      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'npsSubmitted':
            return addWebsocketDocuments(
              state,
              [action.payload],
              transformWebSocketNps,
              ref,
            );
          default:
            return state;
        }
      }
      return state;
    }
    default:
      return state;
  }
}
