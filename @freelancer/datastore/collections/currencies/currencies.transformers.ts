import { toNumber } from '@freelancer/utils';
import { CurrencyApi } from 'api-typings/common/common';
import { Currency, CurrencyAjax } from './currencies.model';

export function transformCurrency(currency: CurrencyApi): Currency {
  return {
    code: currency.code,
    country: currency.country,
    id: currency.id,
    name: currency.name,
    sign: currency.sign,
    isExternal: currency.is_external,
    exchangeRate: currency.exchange_rate,
  };
}

export function transformCurrencyAjax(currency: CurrencyAjax): Currency {
  return {
    code: currency.code,
    country: currency.country,
    id: toNumber(currency.id),
    name: currency.name,
    sign: currency.sign,
    isExternal: !!toNumber(currency.is_external),
  };
}
