import {
  Backend,
  getNearbyQueryParamValue,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { NearbyProjectsCollection } from './nearby-projects.types';

export function nearbyProjectsBackend(): Backend<NearbyProjectsCollection> {
  return {
    defaultOrder: {
      field: 'submitdate',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      const queryCoordinates = getNearbyQueryParamValue(query, 'location');
      if (!queryCoordinates) {
        throw new Error('Query condition is not supported by this collection.');
      }

      return {
        endpoint: `projects/0.1/projects/active`,
        params: {
          jobs: getQueryParamValue(query, 'skillIds')[0] || [],
          latitude: queryCoordinates.latitude,
          longitude: queryCoordinates.longitude,
          full_description: 'true',
          job_details: 'true',
          proximity_details: 'true',
          only_local: 'true',
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
