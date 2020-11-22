import { MapCoordinates } from '@freelancer/datastore/core';
import { Country } from '../countries/countries.model';
import {
  CountryCode,
  generateCountryObjects,
} from '../countries/countries.seed';
import { Location } from './location.model';

interface GenerateLocationOptions {
  readonly country?: Country;
  readonly city?: string;
  readonly mapCoordinates?: MapCoordinates;
  readonly vicinity?: string;
  readonly administrativeArea?: string;
  readonly fullAddress?: string;
}

export function generateLocationObject({
  country = generateCountryObjects({ countryCodes: [CountryCode.US] })[0],
  city = 'Chicago',
  mapCoordinates = {
    latitude: 41.876,
    longitude: -87.64,
  },
  vicinity = 'Chicago',
  administrativeArea,
  fullAddress = '525 W. Van Buren, Suite 1100, Chicago IL 60607',
}: GenerateLocationOptions = {}): Location {
  return {
    country,
    city,
    mapCoordinates,
    vicinity,
    administrativeArea,
    fullAddress,
  };
}

export enum LocationPreset {
  SYDNEY = 'Sydney',
  MELBOURNE = 'Melbourne',
  KUALA_LUMPUR = 'Kuala Lumpur',
  DHAKA = 'Dhaka',
  KARACHI = 'Karachi',
  MUMBAI = 'Mumbai',
  SEATTLE = 'Seattle',
}

// Subset of the codes from `countries.seed`
export enum LocationCountryCode {
  AU = 'AU',
  BD = 'BD',
  IN = 'IN',
  MY = 'MY',
  PK = 'PK',
  US = 'US',
}

export const locationPresets: {
  [key in LocationPreset]: {
    readonly countryCode: LocationCountryCode;
    readonly city: string;
    readonly mapCoordinates: MapCoordinates;
    readonly vicinity?: string;
    readonly administrativeArea?: string;
  };
} = {
  [LocationPreset.SYDNEY]: {
    countryCode: LocationCountryCode.AU,
    city: 'Sydney',
    mapCoordinates: { latitude: -33.868, longitude: 151.209 },
    vicinity: 'Sydney',
  },
  [LocationPreset.MELBOURNE]: {
    countryCode: LocationCountryCode.AU,
    city: 'Melbourne',
    mapCoordinates: { latitude: -37.813, longitude: 144.963 },
    vicinity: 'Melbourne',
  },
  [LocationPreset.KUALA_LUMPUR]: {
    countryCode: LocationCountryCode.MY,
    city: 'Kuala Lumpur',
    mapCoordinates: { latitude: 3.157, longitude: 101.712 },
    vicinity: 'Kuala Lumpur',
    administrativeArea: 'Federal Territory of Kuala Lumpur',
  },
  [LocationPreset.DHAKA]: {
    countryCode: LocationCountryCode.BD,
    city: 'Dhaka',
    mapCoordinates: { latitude: 23.81, longitude: 90.413 },
    vicinity: 'Dhaka',
    administrativeArea: 'Dhaka Division',
  },
  [LocationPreset.KARACHI]: {
    countryCode: LocationCountryCode.PK,
    city: 'Karachi',
    mapCoordinates: { latitude: 24.926, longitude: 67.108 },
  },
  [LocationPreset.MUMBAI]: {
    countryCode: LocationCountryCode.IN,
    city: 'Mumbai',
    mapCoordinates: { latitude: 19.076, longitude: 72.877 },
  },
  [LocationPreset.SEATTLE]: {
    countryCode: LocationCountryCode.US,
    city: 'Seattle',
    mapCoordinates: { latitude: 47.606, longitude: -122.332 },
    vicinity: 'Seattle',
    administrativeArea: 'Washington',
  },
};
