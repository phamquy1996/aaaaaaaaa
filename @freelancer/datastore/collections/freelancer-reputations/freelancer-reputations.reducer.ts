import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformFreelancerReputations } from './freelancer-reputations.transformers';
import { FreelancerReputationsCollection } from './freelancer-reputations.types';

export function freelancerReputationsReducer(
  state: CollectionStateSlice<FreelancerReputationsCollection> = {},
  action: CollectionActions<FreelancerReputationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'freelancerReputations') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<FreelancerReputationsCollection>(
          state,
          transformIntoDocuments(result, transformFreelancerReputations),
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
