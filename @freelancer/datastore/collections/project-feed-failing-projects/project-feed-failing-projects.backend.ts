import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ProjectFeedFailingProjectsCollection } from './project-feed-failing-projects.types';

export function projectFeedFailingProjectsBackend(): Backend<
  ProjectFeedFailingProjectsCollection
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
        type: 'p',
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
