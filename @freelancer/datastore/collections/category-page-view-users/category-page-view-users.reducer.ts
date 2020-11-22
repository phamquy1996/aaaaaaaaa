import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCategoryPageViewUsers } from './category-page-view-users.transformers';
import { CategoryPageViewUsersCollection } from './category-page-view-users.types';

export function categoryPageViewUsersReducer(
  state: CollectionStateSlice<CategoryPageViewUsersCollection> = {},
  action: CollectionActions<CategoryPageViewUsersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'categoryPageViewUsers') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<CategoryPageViewUsersCollection>(
          state,
          transformIntoDocuments(result.users, transformCategoryPageViewUsers),
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
