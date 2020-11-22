import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUsersLocation } from './users-location.transformers';
import { UsersLocationCollection } from './users-location.types';

export function usersLocationReducer(
  state: CollectionStateSlice<UsersLocationCollection> = {},
  action: CollectionActions<UsersLocationCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'usersLocation') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UsersLocationCollection>(
          state,
          transformIntoDocuments(result.users, transformUsersLocation),
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
