import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProfileCategory } from './profile-categories.transformers';
import { ProfileCategoriesCollection } from './profile-categories.types';

export function profileCategoriesReducer(
  state: CollectionStateSlice<ProfileCategoriesCollection> = {},
  action: CollectionActions<ProfileCategoriesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'profileCategories') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProfileCategoriesCollection>(
          state,
          transformIntoDocuments(
            result.profile_categories,
            transformProfileCategory,
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
