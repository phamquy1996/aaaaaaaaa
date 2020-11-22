import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformReferralInvitationCheck } from './referral-invitation-check.transformers';
import { ReferralInvitationCheckCollection } from './referral-invitation-check.types';

export function referralInvitationCheckReducer(
  state: CollectionStateSlice<ReferralInvitationCheckCollection> = {},
  action: CollectionActions<ReferralInvitationCheckCollection>,
) {
  // Network request fetched items successfully, merge them into the state
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'referralInvitationCheck') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ReferralInvitationCheckCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformReferralInvitationCheck,
            ref.path.authUid,
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
