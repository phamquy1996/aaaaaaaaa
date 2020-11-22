import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { CurrenciesIncludingExternalCollection } from './currencies-including-external.types';

export function currenciesBackend(): Backend<
  CurrenciesIncludingExternalCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/0.1/currencies',
      params: {
        include_external_currencies: 'true',
        currency_codes: getQueryParamValue(query, 'code'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
