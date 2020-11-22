import { CountryApi, LocationApi } from 'api-typings/common/common';
import { Country } from '../countries/countries.model';
import { Location } from '../project-view-users/location.model';

export function transformLocation(location: LocationApi): Location {
  if (!location.country) {
    throw new ReferenceError(`Missing a required location field.`);
  }

  return {
    country: transformCountry(location.country),
    city: location.city,
    mapCoordinates:
      location.latitude !== undefined && location.longitude !== undefined
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : undefined,
    vicinity: location.vicinity,
    administrativeArea: location.administrative_area,
    fullAddress: location.full_address,
  };
}

/**
 * This country object has a `flagUrl` because it's returned by the REST `users`
 * endpoint. The one in the `countries` collection has a `phoneCode` instead.
 */
export function transformCountry(country: CountryApi): Country {
  return {
    id: country.code || '',
    code: country.code || '',
    name: country.name || '',
    flagUrl: country.flag_url,
  };
}
