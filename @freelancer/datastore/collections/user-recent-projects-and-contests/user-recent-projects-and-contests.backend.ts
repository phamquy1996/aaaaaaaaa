import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserRecentProjectsAndContestsCollection } from './user-recent-projects-and-contests.types';

export function userRecentProjectsAndContestsBackend(): Backend<
  UserRecentProjectsAndContestsCollection
> {
  return {
    defaultOrder: {
      field: 'latest',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `navigation/recent-projects-and-contests.php`,
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
