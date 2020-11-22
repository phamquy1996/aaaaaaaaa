import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCountry } from './countries.transformers';
import { CountriesCollection } from './countries.types';

export function countriesReducer(
  state: CollectionStateSlice<CountriesCollection> = {},
  action: CollectionActions<CountriesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'countries') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CountriesCollection>(
          state,
          transformIntoDocuments(result.countries, transformCountry),
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
