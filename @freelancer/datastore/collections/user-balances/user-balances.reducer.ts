import {
  CollectionActions,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserBalance } from './user-balances.transformers';
import { UserBalancesCollection } from './user-balances.types';

export function userBalancesReducer(
  state = {},
  action: CollectionActions<UserBalancesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'userBalances') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserBalancesCollection>(
          state,
          transformIntoDocuments(
            result.account_balances && result.account_balances.balances,
            transformUserBalance,
            result.primary_currency,
          ),
          order,
          ref,
        );
      }
      return state;
    case 'WS_MESSAGE':
      if (
        action.payload.parent_type === 'notifications' &&
        action.payload.type === 'balanceUpdate'
      ) {
        const ref: Reference<UserBalancesCollection> = {
          path: {
            collection: 'userBalances',
            authUid: action.payload.toUserId,
          },
        };
        return mergeWebsocketDocuments<UserBalancesCollection>(
          state,
          transformIntoDocuments(
            action.payload.data.balances,
            transformUserBalance,
            action.payload.data.primary_currency,
          ),
          ref,
        );
      }
      return state;
    default:
      return state;
  }
}
