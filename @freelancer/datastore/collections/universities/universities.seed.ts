import { flatMap } from '@freelancer/datastore/core';
import { CountryCode } from '../countries/countries.seed';
import { University } from './universities.model';

export interface GenerateUniversityOptions {
  readonly countryCodes?: ReadonlyArray<CountryCode>;
}

export function generateUniversityObjects({
  countryCodes = [CountryCode.US],
}: GenerateUniversityOptions = {}): ReadonlyArray<University> {
  return flatMap(countryCodes, code => universities[code] ?? []);
}

// TODO: Generate university objects for countries other than US
export const universities: {
  readonly [C in CountryCode]?: ReadonlyArray<University>;
} = {
  [CountryCode.US]: [
    {
      id: 11173,
      name: 'Brown University',
      countryCode: 'US',
      stateCode: 'RI',
    },
    {
      id: 10095,
      name: 'Harvard University',
      countryCode: 'US',
      stateCode: 'MA',
    },
    {
      id: 10690,
      name: 'Cornell University',
      countryCode: 'US',
      stateCode: 'NY',
    },
    {
      id: 10591,
      name: 'Princeton University',
      countryCode: 'US',
      stateCode: 'NJ',
    },
    {
      id: 10549,
      name: 'Dartmouth College',
      countryCode: 'US',
      stateCode: 'NH',
    },
    {
      id: 10677,
      name: 'Columbia College',
      countryCode: 'US',
      stateCode: 'NY',
    },
    {
      id: 11148,
      name: 'University of Pennsylvania',
      countryCode: 'US',
      stateCode: 'PA',
    },
    {
      id: 9526,
      name: 'Yale University',
      countryCode: 'US',
      stateCode: 'CT',
    },
  ],
};
