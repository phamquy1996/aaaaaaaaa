import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
  uniq,
} from '@freelancer/datastore/core';
import { flatten, isDefined } from '@freelancer/utils';
import { transformExchangeRates } from './exchange-rates.transformers';
import { ExchangeRatesCollection } from './exchange-rates.types';

export function exchangeRatesReducer(
  state: CollectionStateSlice<ExchangeRatesCollection> = {},
  action: CollectionActions<ExchangeRatesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'exchangeRates') {
        const { result, ref, order } = action.payload;

        if (!result.exchange_currencies) {
          throw Error(`Exchange currencies is undefined`);
        }

        const ids =
          ref.path.ids ||
          uniq(
            flatten(
              Object.values(result.exchange_currencies)
                .filter(isDefined)
                .map(value => Object.keys(value)),
            ),
          );

        /**
         * This collection is a map of `Map<from => Map<to, rate>` and we want to transform it
         * to `Map<to => Map<from, rate>`.
         * When querying by `to` then we know the list of `ids` but when querying the entire
         * list we need to get the list of `to`s from the map.
         */
        return mergeDocuments<ExchangeRatesCollection>(
          state,
          transformIntoDocuments(ids, transformExchangeRates, {
            exchangeCurrencies: result.exchange_currencies,
          }),
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
