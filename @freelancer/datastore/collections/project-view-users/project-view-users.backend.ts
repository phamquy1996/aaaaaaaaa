import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ProjectViewUsersCollection } from './project-view-users.types';

export function projectViewUsersBackend(): Backend<ProjectViewUsersCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/users',
      isGaf: false,
      params: {
        avatar: 'true',
        badge_details: 'true',
        country_details: 'true',
        display_info: 'true', // tagline
        employer_reputation: 'true',
        jobs: 'true',
        // this adds lat/long to the location field (country_details includes location)
        location_details: 'true',
        membership_details: 'true',
        preferred_details: 'true',
        qualification_details: 'true',
        responsiveness: 'true',
        reputation: 'true',
        sanction_details: 'true',
        status: 'true',
        users: ids,
        usernames: getQueryParamValue(query, 'username'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
