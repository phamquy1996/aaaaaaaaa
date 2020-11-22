import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserInteraction } from './user-interactions.transformers';
import { UserInteractionsCollection } from './user-interactions.types';

export function userInteractionsReducer(
  state: CollectionStateSlice<UserInteractionsCollection> = {},
  action: CollectionActions<UserInteractionsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userInteractions') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserInteractionsCollection>(
          state,
          transformIntoDocuments(result.interactions, transformUserInteraction),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'userInteractions') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<UserInteractionsCollection>(
          state,
          transformIntoDocuments(
            [result.interaction],
            transformUserInteraction,
          ),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
