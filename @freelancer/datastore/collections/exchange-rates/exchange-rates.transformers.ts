import { ExchangeRateGetResultApi } from 'api-typings/payments/payments';
import { ExchangeRate } from './exchange-rates.model';

export function transformExchangeRates(
  id: string,
  {
    exchangeCurrencies,
  }: {
    readonly exchangeCurrencies: NonNullable<
      ExchangeRateGetResultApi['exchange_currencies']
    >;
  },
): ExchangeRate {
  return {
    id,
    from: Object.entries(exchangeCurrencies).reduce((acc, [from, entry]) => {
      if (entry) {
        const value = entry[id];
        if (value !== undefined) {
          return { ...acc, [from]: value };
        }
      }
      return acc;
    }, {} as ExchangeRate['from']),
  };
}
