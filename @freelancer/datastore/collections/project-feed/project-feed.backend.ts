import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ProjectFeedCollection } from './project-feed.types';

export function projectFeedBackend(): Backend<ProjectFeedCollection> {
  return {
    defaultOrder: {
      field: 'time',
      direction: OrderByDirection.DESC,
    }, // The backend sorts by submitDate but that's a string in NY time :(
    fetch: (authUid, ids, query, order) => ({
      endpoint: `navigation/project-feed/pre-populated.php`,
      isGaf: true,
      params: {
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
