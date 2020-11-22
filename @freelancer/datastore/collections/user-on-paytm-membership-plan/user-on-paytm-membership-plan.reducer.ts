import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserOnPaytmMembershipPlan } from './user-on-paytm-membership-plan.transformers';
import { UserOnPaytmMembershipPlanCollection } from './user-on-paytm-membership-plan.types';

export function userOnPaytmMembershipPlanReducer(
  state = {},
  action: CollectionActions<UserOnPaytmMembershipPlanCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'userOnPaytmMembershipPlan') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserOnPaytmMembershipPlanCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformUserOnPaytmMembershipPlan,
            ref.path.authUid,
          ),
          order,
          ref,
        );
      }
      return state;
    default:
      return state;
  }
}
