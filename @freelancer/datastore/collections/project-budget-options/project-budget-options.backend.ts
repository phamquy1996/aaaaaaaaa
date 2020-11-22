import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { ProjectBudgetOptionsCollection } from './project-budget-options.types';

export function projectBudgetOptionsBackend(): Backend<
  ProjectBudgetOptionsCollection
> {
  return {
    defaultOrder: {
      field: 'minimum',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/0.1/budgets',
      isGaf: false,
      params: {
        currency_ids: [
          ...getQueryParamValue(query, 'currencyId'),
          ...(ids || []).map(toNumber),
        ],
        project_type: getQueryParamValue(query, 'projectType')[0],
        lang: getQueryParamValue(query, 'language')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
