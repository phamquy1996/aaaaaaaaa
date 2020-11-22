import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCurrency } from './currencies.transformers';
import { CurrenciesCollection } from './currencies.types';

export function currenciesReducer(
  state: CollectionStateSlice<CurrenciesCollection> = {},
  action: CollectionActions<CurrenciesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'currencies') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CurrenciesCollection>(
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
