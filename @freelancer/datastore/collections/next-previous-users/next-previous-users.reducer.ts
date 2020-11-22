import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformNextPreviousUsers } from './next-previous-users.transformers';
import { NextPreviousUsersCollection } from './next-previous-users.types';

export function nextPreviousUsersReducer(
  state: CollectionStateSlice<NextPreviousUsersCollection> = {},
  action: CollectionActions<NextPreviousUsersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'nextPreviousUsers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<NextPreviousUsersCollection>(
          state,
          transformIntoDocuments(result.collection, transformNextPreviousUsers),
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
