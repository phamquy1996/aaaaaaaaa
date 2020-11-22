import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMembershipBenefit } from './membership-benefits.transformers';
import { MembershipBenefitsCollection } from './membership-benefits.types';

export function membershipBenefitsReducer(
  state: CollectionStateSlice<MembershipBenefitsCollection> = {},
  action: CollectionActions<MembershipBenefitsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'membershipBenefits') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MembershipBenefitsCollection>(
          state,
          transformIntoDocuments(result.benefits, transformMembershipBenefit),
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
