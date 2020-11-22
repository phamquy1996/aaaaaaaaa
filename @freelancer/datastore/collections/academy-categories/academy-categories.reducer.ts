import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformAcademyCategory } from './academy-categories.transformers';
import { AcademyCategoriesCollection } from './academy-categories.types';

export function academyCategoriesReducer(
  state: CollectionStateSlice<AcademyCategoriesCollection> = {},
  action: CollectionActions<AcademyCategoriesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'academyCategories') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<AcademyCategoriesCollection>(
          state,
          transformIntoDocuments(result, transformAcademyCategory),
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
