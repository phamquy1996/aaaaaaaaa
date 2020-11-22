import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { ThreadsCollection } from '../threads/threads.types';
import { transformContestEntry } from './contest-entries.transformers';
import { ContestEntriesCollection } from './contest-entries.types';

export function contestEntriesReducer(
  state: CollectionStateSlice<ContestEntriesCollection> = {},
  action:
    | CollectionActions<ContestEntriesCollection>
    | CollectionActions<ThreadsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestEntries') {
        const { result, ref, order } = action.payload;
        if (result.entries) {
          return mergeDocuments<ContestEntriesCollection>(
            state,
            transformIntoDocuments(result.entries, transformContestEntry),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }

    default:
      return state;
  }
}
