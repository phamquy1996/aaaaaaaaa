import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformModifyBidSellerFee } from './modify-bid-seller-fees.transformers';
import { ModifyBidSellerFeesCollection } from './modify-bid-seller-fees.types';

export function modifyBidSellerFeesReducer(
  state: CollectionStateSlice<ModifyBidSellerFeesCollection> = {},
  action: CollectionActions<ModifyBidSellerFeesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'modifyBidSellerFees') {
        const { result: modifyBidSellerFee, ref, order } = action.payload;
        return mergeDocuments<ModifyBidSellerFeesCollection>(
          state,
          transformIntoDocuments(
            [modifyBidSellerFee],
            transformModifyBidSellerFee,
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
