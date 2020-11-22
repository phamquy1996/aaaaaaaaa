import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserOnPaytmMembershipPlanCollection } from './user-on-paytm-membership-plan.types';

export function userOnPaytmMembershipPlanBackend(): Backend<
  UserOnPaytmMembershipPlanCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This is only ever for the current user so ordering doesn't matter.
    fetch: (authUid, ids, query, order) => ({
      endpoint: `memberships/isUserOnPaytmMembershipPlan.php`,
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
