import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ManageViewPastProjectsCollection } from './manage-view-past-projects.types';

export function manageViewPastProjectsBackend(): Backend<
  ManageViewPastProjectsCollection
> {
  return {
    defaultOrder: {
      field: 'timeSubmitted',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'manage/projects.php',
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
