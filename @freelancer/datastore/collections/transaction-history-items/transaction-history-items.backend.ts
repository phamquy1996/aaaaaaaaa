import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { TransactionHistoryContextTypeApi } from 'api-typings/payments/payments';
import { TransactionHistoryItem } from './transaction-history-items.model';
import { TransactionHistoryItemsCollection } from './transaction-history-items.types';

export function transactionHistoryItemsBackend(): Backend<
  TransactionHistoryItemsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'payments/0.1/transaction_histories/',
      params: {
        user_id: authUid,
        context_type: getContextTypeQueryParamValue(query),
        // TODO T80441
        other_party_user_ids: getQueryParamValue(query, 'otherPartyUserId'),
        currency_ids: getQueryParamValue(query, 'currencyId'),
        transaction_history_categories: getQueryParamValue(query, 'category'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
function getContextTypeQueryParamValue(
  query?: RawQuery<TransactionHistoryItem>,
): TransactionHistoryContextTypeApi | undefined {
  return getQueryParamValue(query, 'context', param =>
    param.condition === '=='
      ? param.value && param.value.contextType
      : undefined,
  )[0];
}
