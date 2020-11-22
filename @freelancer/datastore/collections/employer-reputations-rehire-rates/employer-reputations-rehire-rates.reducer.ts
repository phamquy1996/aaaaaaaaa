import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformEmployerReputationsRehireRates } from './employer-reputations-rehire-rates.transformers';
import { EmployerReputationsRehireRatesCollection } from './employer-reputations-rehire-rates.types';

export function employerReputationsRehireRatesReducer(
  state: CollectionStateSlice<EmployerReputationsRehireRatesCollection> = {},
  action: CollectionActions<EmployerReputationsRehireRatesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'employerReputationsRehireRates') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<EmployerReputationsRehireRatesCollection>(
          state,
          transformIntoDocuments(
            result,
            transformEmployerReputationsRehireRates,
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
