import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ManageViewOpenBidsCollection } from './manage-view-open-bids.types';

export function manageViewOpenBidsBackend(): Backend<
  ManageViewOpenBidsCollection
> {
  return {
    defaultOrder: [
      {
        field: 'bidStatusOrdering',
        direction: OrderByDirection.ASC,
      },
      {
        field: 'bidPlacedDate',
        direction: OrderByDirection.DESC,
      },
    ],
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'manage/bids.php',
      isGaf: true,
      params: {
        type: 'active',
        filter:
          query && query.searchQueryParams && query.searchQueryParams.filter,
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
