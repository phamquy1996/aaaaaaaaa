import { assertNever } from '@freelancer/utils';
import { Currency } from './currencies.model';

export function generateCurrencyObjects(): ReadonlyArray<Currency> {
  return [
    CurrencyCode.USD,
    CurrencyCode.NZD,
    CurrencyCode.AUD,
    CurrencyCode.GBP,
    CurrencyCode.HKD,
    CurrencyCode.SGD,
    CurrencyCode.EUR,
    CurrencyCode.CAD,
    CurrencyCode.INR,
    CurrencyCode.TKN,
  ].map(code => generateCurrencyObject(code));
}

export enum CurrencyCode {
  USD = 'USD',
  NZD = 'NZD',
  AUD = 'AUD',
  GBP = 'GBP',
  HKD = 'HKD',
  SGD = 'SGD',
  EUR = 'EUR',
  CAD = 'CAD',
  INR = 'INR',
  TKN = 'TKN',
}

export function generateCurrencyObject(currencyCode: CurrencyCode): Currency {
  switch (currencyCode) {
    case CurrencyCode.USD:
      return {
        code: 'USD',
        country: 'US',
        id: 1,
        name: 'US Dollar',
        sign: '$',
        isExternal: false,
        exchangeRate: 1,
      };
    case CurrencyCode.NZD:
      return {
        code: 'NZD',
        country: 'NZ',
        id: 2,
        name: 'New Zealand Dollar',
        sign: '$',
        isExternal: false,
        exchangeRate: 0.625965,
      };
    case CurrencyCode.AUD:
      return {
        code: 'AUD',
        country: 'AU',
        id: 3,
        name: 'Australian Dollar',
        sign: '$',
        isExternal: false,
        exchangeRate: 0.652512,
      };
    case CurrencyCode.GBP:
      return {
        code: 'GBP',
        country: 'UK',
        id: 4,
        name: 'British Pounds',
        sign: '£',
        isExternal: false,
        exchangeRate: 1.248337,
      };
    case CurrencyCode.HKD:
      return {
        code: 'HKD',
        country: 'HK',
        id: 5,
        name: 'HongKong Dollar',
        sign: '$',
        isExternal: false,
        exchangeRate: 0.122203,
      };
    case CurrencyCode.SGD:
      return {
        code: 'SGD',
        country: 'SG',
        id: 6,
        name: 'Singapore Dollar',
        sign: '$',
        isExternal: false,
        exchangeRate: 0.704349,
      };
    case CurrencyCode.EUR:
      return {
        code: 'EUR',
        country: 'EU',
        id: 8,
        name: 'Euro',
        sign: '€',
        isExternal: false,
        exchangeRate: 1.0534,
      };
    case CurrencyCode.CAD:
      return {
        code: 'CAD',
        country: 'CA',
        id: 9,
        name: 'Canadian Dollar',
        sign: '$',
        isExternal: false,
        exchangeRate: 0.722093,
      };
    case CurrencyCode.INR:
      return {
        code: 'INR',
        country: 'IN',
        id: 11,
        name: 'Indian Rupee',
        sign: '₹',
        isExternal: false,
        exchangeRate: 0.013366,
      };
    case CurrencyCode.TKN:
      return {
        code: 'TKN',
        country: 'FL',
        id: 40,
        name: 'Token',
        sign: '⏱️',
        isExternal: true,
        exchangeRate: 0.0,
      };

    default:
      return assertNever(currencyCode, `Unknown currencyCode ${currencyCode}.`);
  }
}

export function usdCurrency() {
  return {
    currencyCode: CurrencyCode.USD,
  };
}
