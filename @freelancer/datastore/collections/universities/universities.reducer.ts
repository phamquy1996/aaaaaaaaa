import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUniversities } from './universities.transformers';
import { UniversitiesCollection } from './universities.types';

export function universitiesReducer(
  state: CollectionStateSlice<UniversitiesCollection> = {},
  action: CollectionActions<UniversitiesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'universities') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UniversitiesCollection>(
          state,
          transformIntoDocuments(result.universities, transformUniversities),
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
