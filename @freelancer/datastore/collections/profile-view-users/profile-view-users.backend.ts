import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ProfileViewUserPayload } from './profile-view-users.model';
import { ProfileViewUsersCollection } from './profile-view-users.types';

export function profileViewUsersBackend(): Backend<ProfileViewUsersCollection> {
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
        cover_image: 'true',
        display_info: 'true',
        country_details: 'true',
        jobs: 'true',
        portfolio_details: 'true',
        preferred_details: 'true',
        profile_description: 'true',
        qualification_details: 'true',
        recommendations: 'true',
        responsiveness: 'true',
        status: 'true',
        users: ids || [],
        usernames: getQueryParamValue(query, 'username'),
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, object, original) => {
      const payload: ProfileViewUserPayload = {
        ...(object.hourlyRate !== original.hourlyRate
          ? { hourly_rate: object.hourlyRate }
          : {}),
        ...(object.profileDescription !== original.profileDescription
          ? { profile_description: object.profileDescription }
          : {}),
        ...(object.tagLine !== original.tagLine
          ? { tagline: object.tagLine }
          : {}),
      };

      return {
        endpoint: `users/0.1/self/profile`,
        payload,
        method: 'PUT',
      };
    },
    remove: undefined,
  };
}
