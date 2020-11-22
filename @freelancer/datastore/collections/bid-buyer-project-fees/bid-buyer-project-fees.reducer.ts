import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformBidBuyerProjectFee } from './bid-buyer-project-fees.transformers';
import { BidBuyerProjectFeesCollection } from './bid-buyer-project-fees.types';

export function bidBuyerProjectFeesReducer(
  state: CollectionStateSlice<BidBuyerProjectFeesCollection> = {},
  action: CollectionActions<BidBuyerProjectFeesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'bidBuyerProjectFees') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BidBuyerProjectFeesCollection>(
          state,
          transformIntoDocuments(result.bids, transformBidBuyerProjectFee),
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
