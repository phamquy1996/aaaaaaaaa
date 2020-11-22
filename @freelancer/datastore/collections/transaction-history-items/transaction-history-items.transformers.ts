import {
  TransactionHistoryContextApi,
  TransactionHistoryItemApi,
  TransactionHistoryMetaDataApi,
} from 'api-typings/payments/payments';
import {
  TransactionHistoryContext,
  TransactionHistoryItem,
  TransactionHistoryMetadata,
} from './transaction-history-items.model';

export function transformTransactionHistory(
  transactionHistory: TransactionHistoryItemApi,
): TransactionHistoryItem {
  return {
    id: transactionHistory.transaction_history_item_id,
    userId: transactionHistory.user_id,
    currencyId: transactionHistory.currency,
    category: transactionHistory.category,
    userBalance: transactionHistory.user_balance || undefined,
    realBalance: transactionHistory.real_balance || undefined,
    bonusBalance: transactionHistory.bonus_balance || undefined,
    transactionId: transactionHistory.transaction_id || undefined,
    amount: transactionHistory.amount || undefined,
    parentId: transactionHistory.parent_id || undefined,
    otherPartyUserId: transactionHistory.other_party_user_id,
    date: transactionHistory.date * 1000,
    context: transactionHistory.context
      ? transformTransactionHistoryContext(transactionHistory.context)
      : undefined,
    metadata: transactionHistory.metadata
      ? transformTransactionHistoryMetadata(transactionHistory.metadata)
      : undefined,
  };
}

export function transformTransactionHistoryContext(
  transactionHistoryContext: TransactionHistoryContextApi,
): TransactionHistoryContext {
  return {
    contextId: transactionHistoryContext.context_id,
    contextType: transactionHistoryContext.context_type,
  };
}

export function transformTransactionHistoryMetadata(
  transactionHistoryMetadata: TransactionHistoryMetaDataApi,
): TransactionHistoryMetadata {
  return {
    projectName: transactionHistoryMetadata.project_name,
    freelancerUsername: transactionHistoryMetadata.freelancer_username,
  };
}
