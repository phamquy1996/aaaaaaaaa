import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ManageViewOngoingProjectsCollection } from './manage-view-ongoing-projects.types';

export function manageViewOngoingProjectsBackend(): Backend<
  ManageViewOngoingProjectsCollection
> {
  return {
    defaultOrder: {
      field: 'awardTime',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'manage/projects.php',
      isGaf: true,
      params: {
        type: 'ongoing',
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
