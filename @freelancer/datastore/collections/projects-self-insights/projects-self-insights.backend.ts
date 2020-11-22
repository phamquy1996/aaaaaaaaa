import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ProjectsSelfInsightsCollection } from './projects-self-insights.types';

export function projectsSelfInsightsBackend(): Backend<
  ProjectsSelfInsightsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/0.1/self/insights',
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
