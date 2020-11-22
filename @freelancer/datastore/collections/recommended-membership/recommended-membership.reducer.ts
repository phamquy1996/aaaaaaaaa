import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformRecommendedMembershipPackage } from './recommended-membership.transformers';
import { RecommendedMembershipCollection } from './recommended-membership.types';

export function recommendedMembershipReducer(
  state: CollectionStateSlice<RecommendedMembershipCollection> = {},
  action: CollectionActions<RecommendedMembershipCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'recommendedMembership') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<RecommendedMembershipCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformRecommendedMembershipPackage,
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
