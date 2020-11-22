import { toNumber } from '@freelancer/utils';
import { FreelancerBidRestrictionsGetResultAjax } from './bid-restrictions.backend-model';
import { FreelancerBidRestrictions } from './bid-restrictions.model';

export function transformBidRestrictions(
  bidRestrictions: FreelancerBidRestrictionsGetResultAjax,
  projectId: number | string,
): FreelancerBidRestrictions {
  return {
    id: toNumber(projectId),
    openForBidding: bidRestrictions.openForBidding,
    freelancerHasBalance: bidRestrictions.freelancerHasBalance,
    freelancerPreferredRequirementMet:
      bidRestrictions.freelancerPreferredRequirementMet,
    arrowCrossPostingRequirementMet:
      bidRestrictions.arrowCrossPostingRequirementMet,
    deloitteRequirements: bidRestrictions.deloitteRequirements,
    premiumProjectEligible: bidRestrictions.premiumProjectEligible,
    premiumVerifiedProjectEligible:
      bidRestrictions.premiumVerifiedProjectEligible,
    featuredPremiumProjectEligible:
      bidRestrictions.featuredPremiumProjectEligible,
    premiumBidAmountEligible: bidRestrictions.premiumBidAmountEligible,
  };
}
