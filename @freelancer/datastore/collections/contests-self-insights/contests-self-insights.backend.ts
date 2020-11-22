import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ContestsSelfInsightsCollection } from './contests-self-insights.types';

export function contestsSelfInsightsBackend(): Backend<
  ContestsSelfInsightsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/0.1/self/insights',
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
