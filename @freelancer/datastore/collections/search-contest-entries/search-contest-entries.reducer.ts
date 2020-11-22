import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestViewEntry } from '../contest-view-entries/contest-view-entries.transformers';
import { SearchContestEntriesCollection } from './search-contest-entries.types';

export function searchContestEntriesReducer(
  state: CollectionStateSlice<SearchContestEntriesCollection> = {},
  action: CollectionActions<SearchContestEntriesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchContestEntries') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchContestEntriesCollection>(
          state,
          transformIntoDocuments(
            result.entries,
            transformContestViewEntry,
            ref.path.authUid,
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
