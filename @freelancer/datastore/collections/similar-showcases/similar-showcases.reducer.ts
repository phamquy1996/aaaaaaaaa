import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSimilarShowcases } from './similar-showcases.transformers';
import { SimilarShowcasesCollection } from './similar-showcases.types';

export function similarShowcasesReducer(
  state: CollectionStateSlice<SimilarShowcasesCollection> = {},
  action: CollectionActions<SimilarShowcasesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'similarShowcases') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SimilarShowcasesCollection>(
          state,
          transformIntoDocuments(result.collection, transformSimilarShowcases),
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
