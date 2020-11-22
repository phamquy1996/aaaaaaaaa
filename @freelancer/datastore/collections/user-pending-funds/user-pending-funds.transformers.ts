import { BalanceApi, UserApi } from 'api-typings/users/users';
import { transformCurrency } from '../currencies/currencies.transformers';
import { UserPendingFunds } from './user-pending-funds.model';

export function transformPendingFunds(
  pendingFunds: BalanceApi,
  user: UserApi,
): UserPendingFunds {
  if (!pendingFunds.currency) {
    throw new Error('Currency missing from pendingFunds');
  }

  return {
    id: pendingFunds.currency.id,
    currency: transformCurrency(pendingFunds.currency),
    amount: pendingFunds.amount || 0,
  };
}
