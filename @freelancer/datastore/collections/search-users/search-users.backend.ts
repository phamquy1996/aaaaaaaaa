import {
  Backend,
  getNearbyQueryParamValue,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { SearchUsersCollection } from './search-users.types';

export function searchUsersBackend(): Backend<SearchUsersCollection> {
  return {
    // TODO: Sort by user reputation score after adding it to the response of
    // the API endpoint (T126805).
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    // TODO: Add keyword filter after D136560 lands in production.
    fetch: (authUid, ids, query) => {
      const searchCoordinates = getNearbyQueryParamValue(
        query,
        'searchCoordinates',
      );
      const isOnline = getQueryParamValue(query, 'isOnline')[0];

      if (isDefined(isOnline) && !isOnline) {
        throw new Error('Cannot filter offline users');
      }

      return {
        endpoint: 'users/0.1/users/directory/',
        isGaf: false,
        params: {
          // Projections
          avatar: true,
          country_details: true,
          jobs: true,
          location_details: true,
          online_offline_details: true,
          online_only: isOnline,
          preferred_details: true,
          profile_description: true,
          qualification_details: true,
          reputation: true,
          status: true,

          // Filters
          countries: getQueryParamValue(query, 'country').map(
            country => country.name,
          ),
          hourly_rate_max: getQueryParamValue(query, 'hourlyRate', param =>
            param.condition === '<=' ? param.value : undefined,
          ).filter(isDefined)[0],
          hourly_rate_min: getQueryParamValue(query, 'hourlyRate', param =>
            param.condition === '>=' ? param.value : undefined,
          ).filter(isDefined)[0],
          insignias: getQueryParamValue(query, 'qualifications')[0]?.map(
            qualification => qualification.insigniaId,
          ),
          location_latitude: searchCoordinates?.latitude,
          location_longitude: searchCoordinates?.longitude,
          offset: query?.searchQueryParams?.offset,
          pool_ids: getQueryParamValue(query, 'poolIds')[0],
          query: query?.searchQueryParams?.query,
          rating: getQueryParamValue(query, 'rating')[0],
          review_count_max: getQueryParamValue(query, 'reviews', param =>
            param.condition === '<=' ? param.value : undefined,
          ).filter(isDefined)[0],
          review_count_min: getQueryParamValue(query, 'reviews', param =>
            param.condition === '>=' ? param.value : undefined,
          ).filter(isDefined)[0],
          skills: getQueryParamValue(query, 'skills')[0]?.map(
            skill => skill.id,
          ),
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
