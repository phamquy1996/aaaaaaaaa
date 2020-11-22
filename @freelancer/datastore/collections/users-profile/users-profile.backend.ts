import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { DateOfBirthApi } from 'api-typings/users/users';
import { Enterprise } from '../enterprise/enterprise.model';
import { transformLocationToLocationApi } from './users-profile.transformers';
import { UsersProfileCollection } from './users-profile.types';

export function usersProfileBackend(): Backend<UsersProfileCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/self',
      params: {
        avatar: 'true',
        display_info: 'true',
        location_details: 'true',
        profile_description: 'true',
        search_language_details: 'true',
        status: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, partial, original) => {
      const endpoint = 'users/0.1/self/account';
      const method = 'PUT';

      const originalAddress = original.address || {};
      const searchLanguages:
        | ReadonlyArray<string>
        | undefined = partial.searchLanguages?.filter(isDefined);

      const dateOfBirth: DateOfBirthApi | undefined =
        partial.dateOfBirth &&
        partial.dateOfBirth.day !== undefined &&
        partial.dateOfBirth.month !== undefined &&
        partial.dateOfBirth.year !== undefined
          ? {
              day: partial.dateOfBirth.day,
              month: partial.dateOfBirth.month,
              year: partial.dateOfBirth.year,
            }
          : undefined;

      // prepare the payload by unpacking partial data
      let payload = {
        ...(partial.firstName ? { first_name: partial.firstName } : {}),
        ...(partial.lastName ? { last_name: partial.lastName } : {}),
        ...(partial.profileDescription
          ? { profile_description: partial.profileDescription }
          : {}),
        ...(partial.tagline ? { tagline: partial.tagline } : {}),
        ...(partial.hourlyRate ? { hourly_rate: partial.hourlyRate } : {}),
        ...(searchLanguages ? { search_languages: searchLanguages } : {}),
        ...(partial.location
          ? { location: transformLocationToLocationApi(partial.location) }
          : {}),
        ...(dateOfBirth ? { date_of_birth: dateOfBirth } : {}),
      };

      // For Deloitte, users can't update address, and if address fields
      // are included in the request, the backend will throw an error.
      const addressPayload = original?.enterpriseIds?.includes(
        Enterprise.DELOITTE_DC,
      )
        ? {}
        : // Due to the way the api handles data,
        // address1, city, zip and state code always need
        // a value
        partial.address
        ? {
            ...(partial.address.address1
              ? { address1: partial.address.address1 }
              : {
                  address1: originalAddress ? originalAddress.address1 : {},
                }),
            ...(partial.address.address2
              ? { address2: partial.address.address2 }
              : {}),
            ...(partial.address.city
              ? { city: partial.address.city }
              : { city: originalAddress ? originalAddress.city : {} }),
            ...(partial.address.zip
              ? { zip: partial.address.zip }
              : { zip: originalAddress ? originalAddress.zip : {} }),
            ...(partial.address.state_code
              ? { state_code: partial.address.state_code }
              : {
                  state_code: originalAddress ? originalAddress.state_code : {},
                }),
          }
        : {
            ...originalAddress,
          };

      payload = { ...payload, ...addressPayload };

      return {
        endpoint,
        method,
        payload,
      };
    },
    remove: undefined,
  };
}
