import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { CurrencyDetectCollection } from './currency-detect.types';

export function currencyDetectBackend(): Backend<CurrencyDetectCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: () => ({
      endpoint: 'currency/detectCurrency.php',
      isGaf: true,
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
