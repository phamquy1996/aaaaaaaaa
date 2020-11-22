import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ContestMinimumBudgetClassificationsCollection } from './contest-minimum-budget-classifications.types';

export function contestMinimumBudgetClassificationsBackend(): Backend<
  ContestMinimumBudgetClassificationsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/getContestMinimumBudgetClassifications.php',
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
