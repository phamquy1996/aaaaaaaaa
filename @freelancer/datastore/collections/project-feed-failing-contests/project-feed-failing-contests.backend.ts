import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ProjectFeedFailingContestsCollection } from './project-feed-failing-contests.types';

export function projectFeedFailingContestsBackend(): Backend<
  ProjectFeedFailingContestsCollection
> {
  return {
    defaultOrder: {
      field: 'time',
      direction: OrderByDirection.DESC,
    }, // The backend sorts by submitDate but that's a string in NY time :(
    fetch: (authUid, ids, query, order) => ({
      endpoint: `navigation/project-feed/pre-populated-xp-projectcontest.php`,
      isGaf: true,
      params: {
        type: 'c',
        jobIds: getQueryParamValue(query, 'jobIds')[0],
        fromWebapp: true,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
