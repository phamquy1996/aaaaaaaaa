import { TransactionHistoryDetailElementApi } from 'api-typings/payments/payments';
import { TransactionHistoryDetail } from './transaction-history-details.model';

export function transformTransactionHistoryDetail(
  transactionHistoryDetail: TransactionHistoryDetailElementApi & {
    readonly index: number;
  },
): TransactionHistoryDetail {
  return {
    label: transactionHistoryDetail.label,
    value: transactionHistoryDetail.value,
    transactionHistoryId: transactionHistoryDetail.transaction_history_id,
    id: `${
      transactionHistoryDetail.label
    }${transactionHistoryDetail.transaction_history_id.toString()}`,
    index: transactionHistoryDetail.index,
  };
}
