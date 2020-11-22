import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformBidAwardRevokeReasons } from './bid-award-revoke-reasons.transformers';
import { BidAwardRevokeReasonsCollection } from './bid-award-revoke-reasons.types';

export function bidAwardRevokeReasonsReducer(
  state: CollectionStateSlice<BidAwardRevokeReasonsCollection> = {},
  action: CollectionActions<BidAwardRevokeReasonsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'bidAwardRevokeReasons') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BidAwardRevokeReasonsCollection>(
          state,
          transformIntoDocuments(result, transformBidAwardRevokeReasons),
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
