import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchProjectsSelfCollection } from './search-projects-self.types';

export function searchProjectsSelfBackend(): Backend<
  SearchProjectsSelfCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This endpoint is only used with search queries so doesn't need an ordering

    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/self`,
      params: {
        // FIXME: This should be part of the model
        status:
          query && query.searchQueryParams && query.searchQueryParams.status,

        // FIXME: This should be part of the model
        role: query && query.searchQueryParams && query.searchQueryParams.role,

        query:
          query && query.searchQueryParams && query.searchQueryParams.query,

        type: query && query.searchQueryParams && query.searchQueryParams.type,

        // FIXME: Remove this
        offset:
          query && query.searchQueryParams && query.searchQueryParams.offset,

        // FIXME: The sort should be on a field of the model and this should then be changed to use `order`
        sort_field:
          query && query.searchQueryParams && query.searchQueryParams.sortField,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
