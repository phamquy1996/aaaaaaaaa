import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDeveloperToken } from './developer-tokens.transformers';
import { DeveloperTokensCollection } from './developer-tokens.types';

export function developerTokensReducer(
  state: CollectionStateSlice<DeveloperTokensCollection> = {},
  action: CollectionActions<DeveloperTokensCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'developerTokens') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<DeveloperTokensCollection>(
          state,
          transformIntoDocuments(result.bearer_tokens, transformDeveloperToken),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'developerTokens') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments<DeveloperTokensCollection>(
          state,
          transformIntoDocuments([result], transformDeveloperToken),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
