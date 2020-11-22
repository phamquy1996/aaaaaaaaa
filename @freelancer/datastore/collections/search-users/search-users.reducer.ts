import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchUser } from './search-users.transformers';
import { SearchUsersCollection } from './search-users.types';

export function searchUsersReducer(
  state: CollectionStateSlice<SearchUsersCollection> = {},
  action: CollectionActions<SearchUsersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchUsers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchUsersCollection>(
          state,
          transformIntoDocuments(result.users, transformSearchUser),
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
