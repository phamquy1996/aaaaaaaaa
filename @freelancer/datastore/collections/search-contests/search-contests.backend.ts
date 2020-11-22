import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchContestsCollection } from './search-contests.types';

export function searchContestsBackend(): Backend<SearchContestsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This endpoint is only used with search queries so doesn't need an ordering

    fetch: (authUid, ids, query, order) => ({
      endpoint: `search/contests.php`,
      isGaf: true,
      q: query && query.searchQueryParams && query.searchQueryParams.q,
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
