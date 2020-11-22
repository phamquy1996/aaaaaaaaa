import { CurrencyApi } from 'api-typings/common/common';
import { BalanceApi } from 'api-typings/users/users';
import { transformCurrency } from '../currencies/currencies.transformers';
import { UserBalance } from './user-balances.model';

export function transformUserBalance(
  balance: BalanceApi,
  primaryCurrency?: CurrencyApi,
): UserBalance {
  if (!balance.currency) {
    throw new Error('Currency missing from pendingFunds');
  }

  const isPrimaryCurrency =
    !!primaryCurrency && balance.currency.code === primaryCurrency.code;

  return {
    id: balance.currency.id,
    currency: transformCurrency(balance.currency),
    amount: balance.amount || 0,
    primary: isPrimaryCurrency,
  };
}
