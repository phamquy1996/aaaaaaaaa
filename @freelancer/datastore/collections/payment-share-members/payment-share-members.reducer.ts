import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformPaymentShareMember } from './payment-share-members.transformers';
import { PaymentShareMembersCollection } from './payment-share-members.types';

export function paymentShareMembersReducer(
  state: CollectionStateSlice<PaymentShareMembersCollection> = {},
  action: CollectionActions<PaymentShareMembersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'paymentShareMembers') {
        const { result, ref, order } = action.payload;

        if (!result.members) {
          return state;
        }

        return mergeDocuments<PaymentShareMembersCollection>(
          state,
          transformIntoDocuments(result.members, transformPaymentShareMember),
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
