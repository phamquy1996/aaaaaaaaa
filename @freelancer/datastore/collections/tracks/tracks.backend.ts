import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { TracksCollection } from './tracks.types';

export function tracksBackend(): Backend<TracksCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'localJobs/getTracks.php',
      isGaf: true,
      params: {
        project_id: getQueryParamValue(query, 'projectId')[0],
        user_id: getQueryParamValue(query, 'userId')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
