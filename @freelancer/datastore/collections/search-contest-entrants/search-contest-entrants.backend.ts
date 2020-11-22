import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchContestEntrantsCollection } from './search-contest-entrants.types';

export function searchContestEntrantsBackend(): Backend<
  SearchContestEntrantsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    }, // This endpoint is only used with search queries so doesn't need an ordering

    fetch: (authUid, ids, query) => ({
      endpoint: `contests/0.1/entrants/all`,
      params: {
        contest_ids:
          query &&
          query.searchQueryParams &&
          query.searchQueryParams.contestIds,
        entry_statuses:
          query &&
          query.searchQueryParams &&
          query.searchQueryParams.entryStatuses,
        query:
          query && query.searchQueryParams && query.searchQueryParams.query,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
