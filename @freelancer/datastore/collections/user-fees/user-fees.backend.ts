import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { UserFeesCollection } from './user-fees.types';

export function userFeesBackend(): Backend<UserFeesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/users/fees',
      params: {
        currencies: [
          ...(ids || []).map(toNumber),
          ...getQueryParamValue(query, 'currencyId'),
        ],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
