import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ManageViewOpenProjectsCollection } from './manage-view-open-projects.types';

export function manageViewOpenProjectsBackend(): Backend<
  ManageViewOpenProjectsCollection
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
        type: 'open',
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
