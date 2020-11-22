import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMembershipRenewal } from './membership-renewals.transformers';
import { MembershipRenewalsCollection } from './membership-renewals.types';

export function membershipRenewalsReducer(
  state: CollectionStateSlice<MembershipRenewalsCollection> = {},
  action: CollectionActions<MembershipRenewalsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'membershipRenewals') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MembershipRenewalsCollection>(
          state,
          transformIntoDocuments(result.renewals, transformMembershipRenewal),
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
