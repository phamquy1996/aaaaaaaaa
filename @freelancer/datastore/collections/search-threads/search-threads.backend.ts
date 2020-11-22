import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchThreadsCollection } from './search-threads.types';

export function searchThreadsBackend(): Backend<SearchThreadsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This endpoint is only used with search queries so doesn't need an ordering

    fetch: (authUid, ids, query, order) => ({
      endpoint: `messages/0.1/threads/search`,
      params: {
        query:
          query &&
          query.searchQueryParams &&
          query.searchQueryParams.searchTerm,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
