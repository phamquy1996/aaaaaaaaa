import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCategoryPageContent } from './category-page-content.transformers';
import { CategoryPageContentCollection } from './category-page-content.types';

export function categoryPageContentReducer(
  state: CollectionStateSlice<CategoryPageContentCollection> = {},
  action: CollectionActions<CategoryPageContentCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'categoryPageContent') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CategoryPageContentCollection>(
          state,
          transformIntoDocuments(result, transformCategoryPageContent),
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
