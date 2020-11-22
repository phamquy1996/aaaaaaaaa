import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSuperuserThread } from './superuser-threads.transformers';
import { SuperuserThreadsCollection } from './superuser-threads.types';

export function superuserThreadsReducer(
  state: CollectionStateSlice<SuperuserThreadsCollection> = {},
  action: CollectionActions<SuperuserThreadsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'superuserThreads') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SuperuserThreadsCollection>(
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
