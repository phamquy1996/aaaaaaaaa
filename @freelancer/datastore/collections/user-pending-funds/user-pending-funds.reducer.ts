import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformPendingFunds } from './user-pending-funds.transformers';
import { UserPendingFundsCollection } from './user-pending-funds.types';

export function userPendingFundsReducer(
  state = {},
  action: CollectionActions<UserPendingFundsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'userPendingFunds') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserPendingFundsCollection>(
          state,
          transformIntoDocuments(
            result.account_balances && result.account_balances.pending_funds,
            transformPendingFunds,
            result,
          ),
          order,
          ref,
        );
      }
      return state;
    default:
      return state;
  }
}
