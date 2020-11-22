import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ManageViewContestsCollection } from './manage-view-contests.types';

export function manageViewContestsBackend(): Backend<
  ManageViewContestsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'manage/contests.php',
      isGaf: true,
      params: {
        status: getQueryParamValue(query, 'status'),
        ownerId: getQueryParamValue(query, 'ownerId')[0],
        entrant:
          query && query.searchQueryParams && query.searchQueryParams.entrant,
        query:
          query && query.searchQueryParams && query.searchQueryParams.query,
        offset:
          query && query.searchQueryParams && query.searchQueryParams.offset,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
