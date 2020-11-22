import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { DepositFeesCollection } from './deposit-fees.types';

export function depositFeesBackend(): Backend<DepositFeesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    }, // The order doesn't matter
    fetch: (authUid, ids, query, order) => ({
      endpoint: `payments/0.1/deposits/fees/`,
      params: {
        deposit_method: getQueryParamValue(query, 'depositMethod')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
