import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { SearchContestEntriesCollection } from './search-contest-entries.types';

export function searchContestEntriesBackend(): Backend<
  SearchContestEntriesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This endpoint is only used with search queries so doesn't need an ordering

    fetch: (authUid, ids, query) => ({
      endpoint: `contests/0.1/entries/all`,
      params: {
        contest_ids: getQueryParamValue(query, 'contestId'),
        entry_statuses: getQueryParamValue(query, 'status'),
        query:
          query && query.searchQueryParams && query.searchQueryParams.query,
        entry_number_prefixes:
          query &&
          query.searchQueryParams &&
          query.searchQueryParams.entryNumbers,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
