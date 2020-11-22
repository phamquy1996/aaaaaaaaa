import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformThread } from '../threads/threads.transformers';
import { SearchThreadsCollection } from './search-threads.types';

export function searchThreadsReducer(
  state: CollectionStateSlice<SearchThreadsCollection> = {},
  action: CollectionActions<SearchThreadsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchThreads') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchThreadsCollection>(
          state,
          transformIntoDocuments(
            result.threads,
            transformThread,
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
