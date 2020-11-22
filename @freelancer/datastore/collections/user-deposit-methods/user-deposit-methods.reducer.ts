import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { transformUserDepositMethod } from './user-deposit-methods.transformers';
import { UserDepositMethodsCollection } from './user-deposit-methods.types';

export function userDepositMethodsReducer(
  state: CollectionStateSlice<UserDepositMethodsCollection> = {},
  action: CollectionActions<UserDepositMethodsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userDepositMethods') {
        const { result, ref, order } = action.payload;
        if (result.deposit_methods && result.deposit_methods.deposit_methods) {
          return mergeDocuments<UserDepositMethodsCollection>(
            state,
            transformIntoDocuments(
              result.deposit_methods.deposit_methods,
              transformUserDepositMethod,
              toNumber(ref.path.authUid),
            ),
            order,
            ref,
          );
        }
      }
      return state;
    }
    default:
      return state;
  }
}
