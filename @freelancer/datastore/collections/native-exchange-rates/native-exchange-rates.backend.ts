import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { FxTypeApi } from 'api-typings/payments/payments';
import { NativeExchangeRatesCollection } from './native-exchange-rates.types';

export function nativeExchangeRatesBackend(): Backend<
  NativeExchangeRatesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    }, // This does not appear to be sorted in the backend
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'payments/0.1/exchange_rate',
      params: {
        fx_type: FxTypeApi.DEPOSIT,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
