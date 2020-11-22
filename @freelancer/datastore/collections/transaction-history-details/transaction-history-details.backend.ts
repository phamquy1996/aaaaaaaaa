import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { TransactionHistoryDetailsCollection } from './transaction-history-details.types';

export function transactionHistoryDetailsBackend(): Backend<
  TransactionHistoryDetailsCollection
> {
  return {
    defaultOrder: {
      field: 'index',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `payments/0.1/transaction_histories/${
        getQueryParamValue(query, 'transactionHistoryId')[0]
      }/transaction_history_details`,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
