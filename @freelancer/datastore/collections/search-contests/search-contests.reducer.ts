import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchContest } from './search-contests.transformers';
import { SearchContestsCollection } from './search-contests.types';

export function searchContestsReducer(
  state: CollectionStateSlice<SearchContestsCollection> = {},
  action: CollectionActions<SearchContestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchContests') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchContestsCollection>(
          state,
          transformIntoDocuments(result, transformSearchContest),
          order,
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
