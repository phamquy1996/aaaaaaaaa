import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ContestBudgetRangesCollection } from './contest-budget-ranges.types';

export function contestBudgetRangesBackend(): Backend<
  ContestBudgetRangesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/getBudgetRanges.php',
      isGaf: true,
      params: {
        currencyId: getQueryParamValue(query, 'currencyId'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
