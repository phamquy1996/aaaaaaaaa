import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchKeywordProjectsCollection } from './search-keyword-projects.types';

export function searchKeywordProjectsBackend(): Backend<
  SearchKeywordProjectsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This endpoint is only used with search queries so doesn't need an ordering

    fetch: (authUid, ids, query, order) => ({
      endpoint: `search/keywordProjects.php`,
      isGaf: true,
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
