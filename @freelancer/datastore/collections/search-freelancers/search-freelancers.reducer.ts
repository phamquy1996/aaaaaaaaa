import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchFreelancer } from './search-freelancers.transformers';
import { SearchFreelancersCollection } from './search-freelancers.types';

export function searchFreelancersReducer(
  state: CollectionStateSlice<SearchFreelancersCollection> = {},
  action: CollectionActions<SearchFreelancersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchFreelancers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchFreelancersCollection>(
          state,
          transformIntoDocuments(result, transformSearchFreelancer),
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
