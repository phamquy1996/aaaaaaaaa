import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ManageViewPastBidsCollection } from './manage-view-past-bids.types';

export function manageViewPastBidsBackend(): Backend<
  ManageViewPastBidsCollection
> {
  return {
    defaultOrder: [
      {
        field: 'projectTimeSubmitted',
        direction: OrderByDirection.DESC,
      },
      {
        field: 'bidAmount',
        direction: OrderByDirection.DESC,
      },
      {
        field: 'projectName',
        direction: OrderByDirection.ASC,
      },
    ],
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'manage/bids.php',
      isGaf: true,
      params: {
        type: 'past',
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
