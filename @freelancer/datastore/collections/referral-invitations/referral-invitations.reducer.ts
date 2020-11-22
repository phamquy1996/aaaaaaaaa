import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformReferralInvitations } from './referral-invitations.transformers';
import { ReferralInvitationsCollection } from './referral-invitations.types';

export function referralInvitationsReducer(
  state: CollectionStateSlice<ReferralInvitationsCollection> = {},
  action: CollectionActions<ReferralInvitationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      const { result, ref, order } = action.payload;
      if (action.payload.type === 'referralInvitations') {
        return mergeDocuments<ReferralInvitationsCollection>(
          state,
          transformIntoDocuments(result, transformReferralInvitations),
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
