import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserIsArrowWhitelisted } from './user-is-arrow-whitelisted.transformers';
import { UserIsArrowWhitelistedCollection } from './user-is-arrow-whitelisted.types';

export function userIsArrowWhitelistedReducer(
  state: CollectionStateSlice<UserIsArrowWhitelistedCollection> = {},
  action: CollectionActions<UserIsArrowWhitelistedCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userIsArrowWhitelisted') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserIsArrowWhitelistedCollection>(
          state,
          transformIntoDocuments([result], transformUserIsArrowWhitelisted),
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
