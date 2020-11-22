import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTransactionHistoryDetail } from './transaction-history-details.transformers';
import { TransactionHistoryDetailsCollection } from './transaction-history-details.types';

export function transactionHistoryDetailsReducer(
  state: CollectionStateSlice<TransactionHistoryDetailsCollection> = {},
  action: CollectionActions<TransactionHistoryDetailsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'transactionHistoryDetails') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TransactionHistoryDetailsCollection>(
          state,
          //  This api call will at most return 9 items.
          transformIntoDocuments(
            result.transaction_history_elements.map((element, index) => ({
              ...element,
              index,
            })),
            transformTransactionHistoryDetail,
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
