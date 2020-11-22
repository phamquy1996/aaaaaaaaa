import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchContestEntrant } from './search-contest-entrants.transformers';
import { SearchContestEntrantsCollection } from './search-contest-entrants.types';

export function searchContestEntrantsReducer(
  state: CollectionStateSlice<SearchContestEntrantsCollection> = {},
  action: CollectionActions<SearchContestEntrantsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchContestEntrants') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchContestEntrantsCollection>(
          state,
          transformIntoDocuments(
            result.entrants,
            transformSearchContestEntrant,
          ),
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
