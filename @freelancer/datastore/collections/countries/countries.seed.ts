import { enumToArray, fromPairs } from '@freelancer/utils';
import { Country } from './countries.model';

export interface GenerateCountryOptions {
  readonly countryCodes?: ReadonlyArray<CountryCode>;
}

export enum CountryCode {
  AF = 'AF',
  AR = 'AR',
  AU = 'AU',
  BD = 'BD',
  BR = 'BR',
  CA = 'CA',
  CL = 'CL',
  CN = 'CN',
  FR = 'FR',
  DE = 'DE',
  HK = 'HK',
  IN = 'IN',
  ID = 'ID',
  IR = 'IR',
  IQ = 'IQ',
  IE = 'IE',
  IL = 'IL',
  IT = 'IT',
  JP = 'JP',
  KR = 'KR',
  MY = 'MY',
  MX = 'MX',
  NL = 'NL',
  NZ = 'NZ',
  PK = 'PK',
  PH = 'PH',
  PL = 'PL',
  PT = 'PT',
  QA = 'QA',
  RU = 'RU',
  SG = 'SG',
  ZA = 'ZA',
  ES = 'ES',
  SE = 'SE',
  CH = 'CH',
  TW = 'TW',
  TH = 'TH',
  TR = 'TR',
  GB = 'GB',
  US = 'US',
  VN = 'VN',
}

/**
 * WARNING: Only use this for a Location object that is returned by the REST
 * `countries` endpoint. It is different when returned by a `users` endpoint.
 * @see project-view-users.seed.ts#generateProjectViewUserCountry
 */
export function generateCountryObjects({
  countryCodes = enumToArray(CountryCode),
}: GenerateCountryOptions = {}): ReadonlyArray<Country> {
  return countryCodes.map(code => countries[code]);
}

export const countries: { readonly [C in CountryCode]: Country } = fromPairs(
  [
    { code: CountryCode.AF, name: 'Afghanistan', phoneCode: 93 },
    { code: CountryCode.AR, name: 'Argentina', phoneCode: 54 },
    { code: CountryCode.AU, name: 'Australia', phoneCode: 61 },
    { code: CountryCode.BD, name: 'Bangladesh', phoneCode: 880 },
    { code: CountryCode.BR, name: 'Brazil', phoneCode: 55 },
    { code: CountryCode.CA, name: 'Canada', phoneCode: 1 },
    { code: CountryCode.CL, name: 'Chile', phoneCode: 56 },
    { code: CountryCode.CN, name: 'China', phoneCode: 86 },
    { code: CountryCode.FR, name: 'France', phoneCode: 33 },
    { code: CountryCode.DE, name: 'Germany', phoneCode: 49 },
    { code: CountryCode.HK, name: 'Hong Kong', phoneCode: 852 },
    { code: CountryCode.IN, name: 'India', phoneCode: 91 },
    { code: CountryCode.ID, name: 'Indonesia', phoneCode: 62 },
    { code: CountryCode.IR, name: 'Iran, Islamic Republic of', phoneCode: 98 },
    { code: CountryCode.IQ, name: 'Iraq', phoneCode: 964 },
    { code: CountryCode.IE, name: 'Ireland', phoneCode: 353 },
    { code: CountryCode.IL, name: 'Israel', phoneCode: 972 },
    { code: CountryCode.IT, name: 'Italy', phoneCode: 39 },
    { code: CountryCode.JP, name: 'Japan', phoneCode: 81 },
    { code: CountryCode.KR, name: 'Korea, Republic of', phoneCode: 82 },
    { code: CountryCode.MY, name: 'Malaysia', phoneCode: 60 },
    { code: CountryCode.MX, name: 'Mexico', phoneCode: 52 },
    { code: CountryCode.NL, name: 'Netherlands', phoneCode: 31 },
    { code: CountryCode.NZ, name: 'New Zealand', phoneCode: 64 },
    { code: CountryCode.PK, name: 'Pakistan', phoneCode: 92 },
    { code: CountryCode.PH, name: 'Philippines', phoneCode: 63 },
    { code: CountryCode.PL, name: 'Poland', phoneCode: 48 },
    { code: CountryCode.PT, name: 'Portugal', phoneCode: 351 },
    { code: CountryCode.QA, name: 'Qatar', phoneCode: 974 },
    { code: CountryCode.RU, name: 'Russian Federation', phoneCode: 7 },
    { code: CountryCode.SG, name: 'Singapore', phoneCode: 65 },
    { code: CountryCode.ZA, name: 'South Africa', phoneCode: 27 },
    { code: CountryCode.ES, name: 'Spain', phoneCode: 34 },
    { code: CountryCode.SE, name: 'Sweden', phoneCode: 46 },
    { code: CountryCode.CH, name: 'Switzerland', phoneCode: 41 },
    { code: CountryCode.TW, name: 'Taiwan', phoneCode: 886 },
    { code: CountryCode.TH, name: 'Thailand', phoneCode: 66 },
    { code: CountryCode.TR, name: 'Turkey', phoneCode: 90 },
    { code: CountryCode.GB, name: 'United Kingdom', phoneCode: 44 },
    { code: CountryCode.US, name: 'United States', phoneCode: 1 },
    { code: CountryCode.VN, name: 'Vietnam', phoneCode: 84 },
  ].map(({ code, name, phoneCode }) => [
    code,
    { id: code, code, name, phoneCode },
  ]),
);
