import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { FxTypeApi } from 'api-typings/payments/payments';
import { ExchangeRatesCollection } from './exchange-rates.types';

export function exchangeRatesBackend(): Backend<ExchangeRatesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    }, // This does not appear to be sorted in the backend
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'payments/0.1/exchange_rate',
      params: {
        fx_type: FxTypeApi.OTHER,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
