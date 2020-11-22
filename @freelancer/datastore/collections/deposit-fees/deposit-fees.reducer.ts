import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDepositFee } from './deposit-fees.transformers';
import { DepositFeesCollection } from './deposit-fees.types';

export function depositFeesReducer(
  state: CollectionStateSlice<DepositFeesCollection> = {},
  action: CollectionActions<DepositFeesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'depositFees') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<DepositFeesCollection>(
          state,
          transformIntoDocuments(
            result.deposit_fee_configs,
            transformDepositFee,
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
