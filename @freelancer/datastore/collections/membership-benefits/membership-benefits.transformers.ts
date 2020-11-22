import { BenefitApi } from 'api-typings/memberships/memberships_types';
import { MembershipBenefit } from './membership-benefits.model';

export function transformMembershipBenefit(
  membershipBenefit: BenefitApi,
): MembershipBenefit {
  return {
    id: membershipBenefit.internal_name,
    name: membershipBenefit.display_name,
    value: membershipBenefit.value === -1 ? Infinity : membershipBenefit.value,
    aggregation: membershipBenefit.duplicate_rule,
  };
}
