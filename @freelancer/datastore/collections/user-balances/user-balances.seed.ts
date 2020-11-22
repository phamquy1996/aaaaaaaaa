import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { UserBalance } from './user-balances.model';

export function generateUserBalanceObjects(): ReadonlyArray<UserBalance> {
  return [
    {
      currency: generateCurrencyObject(CurrencyCode.USD),
      amount: 567,
      primary: true,
    },
  ].map(({ currency, amount, primary }) => ({
    id: currency.id,
    currency,
    amount,
    primary,
  }));
}
