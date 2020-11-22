import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SuperuserSearchThreadsCollection } from './superuser-search-threads.types';

export function superuserSearchThreadsBackend(): Backend<
  SuperuserSearchThreadsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },

    fetch: (authUid, ids, query, order) => ({
      endpoint: `superuser/0.1/admin_threads/search`,
      params: {
        query:
          query &&
          query.searchQueryParams &&
          query.searchQueryParams.searchTerm,
        thread_ids: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
