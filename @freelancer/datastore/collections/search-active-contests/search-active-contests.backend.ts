import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { SearchActiveContestsCollection } from './search-active-contests.types';

export function searchActiveContestsBackend(): Backend<
  SearchActiveContestsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },

    fetch: (authUid, ids, query, order) => ({
      endpoint: `/contests/0.1/contests/active/`,
      params: {
        // projections
        entry_counts: 'true',
        full_description: 'true',
        job_details: 'true',
        upgrade_details: 'true',

        // filters
        jobs: getQueryParamValue(query, 'skillIds')[0],
        offset: query?.searchQueryParams?.offset,
        query: query?.searchQueryParams?.query,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
