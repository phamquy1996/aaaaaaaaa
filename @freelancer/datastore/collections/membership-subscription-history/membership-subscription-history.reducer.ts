import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMembershipSubscriptionHistory } from './membership-subscription-history.transformers';
import { MembershipSubscriptionHistoryCollection } from './membership-subscription-history.types';

export function membershipSubscriptionHistoryReducer(
  state: CollectionStateSlice<MembershipSubscriptionHistoryCollection> = {},
  action: CollectionActions<MembershipSubscriptionHistoryCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'membershipSubscriptionHistory') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MembershipSubscriptionHistoryCollection>(
          state,
          transformIntoDocuments(
            result,
            transformMembershipSubscriptionHistory,
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
