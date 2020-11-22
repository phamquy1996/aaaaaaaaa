import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMembershipSaleItem } from './membership-sale.transformers';
import { MembershipSaleCollection } from './membership-sale.types';

export function membershipSaleReducer(
  state: CollectionStateSlice<MembershipSaleCollection> = {},
  action: CollectionActions<MembershipSaleCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'membershipSale') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<MembershipSaleCollection>(
          state,
          transformIntoDocuments(
            result,
            transformMembershipSaleItem,
            ref.path.authUid,
          ),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
