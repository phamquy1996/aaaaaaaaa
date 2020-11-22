import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCurrency } from '../currencies/currencies.transformers';
import { CurrenciesIncludingExternalCollection } from './currencies-including-external.types';

export function currenciesReducer(
  state: CollectionStateSlice<CurrenciesIncludingExternalCollection> = {},
  action: CollectionActions<CurrenciesIncludingExternalCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'currenciesIncludingExternal') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CurrenciesIncludingExternalCollection>(
          state,
          transformIntoDocuments(result.currencies, transformCurrency),
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
