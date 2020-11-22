import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSuperuserThread } from '../superuser-threads/superuser-threads.transformers';
import { SuperuserSearchThreadsCollection } from './superuser-search-threads.types';

export function superuserSearchThreadsReducer(
  state: CollectionStateSlice<SuperuserSearchThreadsCollection> = {},
  action: CollectionActions<SuperuserSearchThreadsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'superuserSearchThreads') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<SuperuserSearchThreadsCollection>(
          state,
          transformIntoDocuments(
            result.threads,
            transformSuperuserThread,
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
