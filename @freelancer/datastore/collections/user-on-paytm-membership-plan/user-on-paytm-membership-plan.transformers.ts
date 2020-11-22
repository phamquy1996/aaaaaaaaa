import { UserOnPaytmMembershipPlanResultAjax } from './user-on-paytm-membership-plan.backend-model';
import { UserOnPaytmMembershipPlan } from './user-on-paytm-membership-plan.model';

export function transformUserOnPaytmMembershipPlan(
  value: UserOnPaytmMembershipPlanResultAjax,
  id: string,
): UserOnPaytmMembershipPlan {
  return {
    id,
    paytm: value.paytm,
    durationType: value.durationType == null ? undefined : value.durationType,
    durationCycle:
      value.durationCycle == null ? undefined : value.durationCycle,
  };
}
