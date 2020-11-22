import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ContestFeesCollection } from './contest-fees.types';

export function contestFeesBackend(): Backend<ContestFeesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/getFeesForCurrency.php',
      isGaf: true,
      params: {
        currencies: getQueryParamValue(query, 'currencyId'),
        contest_id: getQueryParamValue(query, 'contestId')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
