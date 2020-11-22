import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { CurrenciesCollection } from './currencies.types';

export function currenciesBackend(): Backend<CurrenciesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/0.1/currencies',
      params: {
        currency_codes: getQueryParamValue(query, 'code'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
