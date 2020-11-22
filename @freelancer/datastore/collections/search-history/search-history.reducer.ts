import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchHistory } from './search-history.transformers';
import { SearchHistoryCollection } from './search-history.types';

export function searchHistoryReducer(
  state = {},
  action: CollectionActions<SearchHistoryCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'searchHistory') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchHistoryCollection>(
          state,
          transformIntoDocuments(result, transformSearchHistory),
          order,
          ref,
        );
      }
      return state;
    default:
      return state;
  }
}
