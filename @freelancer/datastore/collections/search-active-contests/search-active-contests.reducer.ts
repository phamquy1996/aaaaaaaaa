import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchActiveContest } from './search-active-contests.transformers';
import { SearchActiveContestsCollection } from './search-active-contests.types';

export function searchActiveContestsReducer(
  state: CollectionStateSlice<SearchActiveContestsCollection> = {},
  action: CollectionActions<SearchActiveContestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchActiveContests') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchActiveContestsCollection>(
          state,
          transformIntoDocuments(result.contests, transformSearchActiveContest),
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
