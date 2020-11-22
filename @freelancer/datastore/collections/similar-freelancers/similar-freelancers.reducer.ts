import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSimilarFreelancers } from './similar-freelancers.transformers';
import { SimilarFreelancersCollection } from './similar-freelancers.types';

export function similarFreelancersReducer(
  state: CollectionStateSlice<SimilarFreelancersCollection> = {},
  action: CollectionActions<SimilarFreelancersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'similarFreelancers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SimilarFreelancersCollection>(
          state,
          transformIntoDocuments(
            result.collection,
            transformSimilarFreelancers,
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
