import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchAllProjectsCollection } from './search-all-projects.types';

export function searchAllProjectsBackend(): Backend<
  SearchAllProjectsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This endpoint is only used with search queries so doesn't need an ordering

    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/projects/all`,
      params: {
        q: query && query.searchQueryParams && query.searchQueryParams.q,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
