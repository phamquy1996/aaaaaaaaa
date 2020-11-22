import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCurrencyAjax } from '../currencies/currencies.transformers';
import { CurrencyDetectCollection } from './currency-detect.types';

export function currencyDetectReducer(
  state: CollectionStateSlice<CurrencyDetectCollection> = {},
  action: CollectionActions<CurrencyDetectCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'currencyDetect') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CurrencyDetectCollection>(
          state,
          transformIntoDocuments([result], transformCurrencyAjax),
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
