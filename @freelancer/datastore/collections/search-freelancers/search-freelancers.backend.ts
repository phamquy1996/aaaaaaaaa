import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchFreelancersCollection } from './search-freelancers.types';

export function searchFreelancersBackend(): Backend<
  SearchFreelancersCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This endpoint is only used with search queries so doesn't need an ordering

    fetch: (authUid, ids, query, order) => ({
      endpoint: `search/topFreelancer.php`,
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
