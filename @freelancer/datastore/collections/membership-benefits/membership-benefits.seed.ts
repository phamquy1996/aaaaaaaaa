import { BenefitDuplicateRuleApi } from 'api-typings/memberships/memberships_types';
import { MembershipBenefit } from './membership-benefits.model';

export interface GenerateMembershipBenefitOptions {
  readonly benefitName?: string;
  readonly enabled?: boolean;
  readonly aggregation?: BenefitDuplicateRuleApi;
}

// TODO: Generate MembershipBenefit objects for different benefits, consolidate
// with membership seed data in project-view-user.seeds
export function generateMembershipBenefitObject({
  benefitName = 'bid_on_premium_projects',
  enabled,
  aggregation = BenefitDuplicateRuleApi.EXISTS,
}: GenerateMembershipBenefitOptions = {}): MembershipBenefit {
  return {
    id: benefitName,
    name: benefitName, // This field seems to be unused
    value: enabled ? 1 : 0,
    aggregation,
  };
}

/**
 * Allows a user to bid on premium projects (see projects.seed.ts#premiumProject).
 * Part of the Plus, Professional and Premier membership plans.
 */
export function bidOnPremiumProjectBenefit(): GenerateMembershipBenefitOptions {
  return {
    benefitName: 'bid_on_premium_projects',
    enabled: true,
  };
}
