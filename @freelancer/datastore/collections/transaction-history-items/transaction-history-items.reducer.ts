import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTransactionHistory } from './transaction-history-items.transformers';
import { TransactionHistoryItemsCollection } from './transaction-history-items.types';

export function transactionHistoryItemsReducer(
  state: CollectionStateSlice<TransactionHistoryItemsCollection> = {},
  action: CollectionActions<TransactionHistoryItemsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'transactionHistoryItems') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TransactionHistoryItemsCollection>(
          state,
          transformIntoDocuments(
            result.transaction_history_items,
            transformTransactionHistory,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
