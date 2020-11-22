// Import datastore helper functions from '@freelancer/datastore/core'
import { CountryApi } from 'api-typings/common/common';
import { Country } from './countries.model';

// Transforms what the backend returns into a format your components can consume
// Should only be called in this collection's reducer (passed to `mergeDocuments`)

export function transformCountry(country: CountryApi): Country {
  if (!country.code) {
    throw new ReferenceError(`Missing a required country field.`);
  }
  return {
    id: country.code,
    code: country.code,
    name: country.name,
    phoneCode: country.phone_code,
    flagUrl: country.flag_url,
  };
}
