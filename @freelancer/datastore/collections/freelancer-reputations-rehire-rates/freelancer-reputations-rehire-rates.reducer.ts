import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformFreelancerReputations } from '../freelancer-reputations/freelancer-reputations.transformers';
import { FreelancerReputationsRehireRatesCollection } from './freelancer-reputations-rehire-rates.types';

export function freelancerReputationsRehireRatesReducer(
  state: CollectionStateSlice<FreelancerReputationsRehireRatesCollection> = {},
  action: CollectionActions<FreelancerReputationsRehireRatesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'freelancerReputationsRehireRates') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<FreelancerReputationsRehireRatesCollection>(
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
