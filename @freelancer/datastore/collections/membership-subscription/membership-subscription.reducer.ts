import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMembershipSubscription } from './membership-subscription.transformers';
import { MembershipSubscriptionCollection } from './membership-subscription.types';

export function membershipSubscriptionReducer(
  state: CollectionStateSlice<MembershipSubscriptionCollection> = {},
  action: CollectionActions<MembershipSubscriptionCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'membershipSubscription') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<MembershipSubscriptionCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformMembershipSubscription,
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
