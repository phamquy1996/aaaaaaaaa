import { FreelancerBidRestrictions } from './bid-restrictions.model';

export interface GenerateBidRestrictionsOptions {
  readonly projectId: number;
  readonly openForBidding?: boolean;
  readonly freelancerHasBalance?: boolean;
  readonly freelancerPreferredRequirementMet?: boolean;
  readonly arrowCrossPostingRequirementMet?: boolean;
  readonly premiumProjectEligibleStatus?: boolean;
  readonly premiumVerifiedProjectEligibleStatus?: boolean;
  readonly featuredPremiumProjectEligibleStatus?: boolean;
  readonly premiumBidAmountEligibleStatus?: boolean;
}

export function generateBidRestrictionsObject({
  projectId,
  openForBidding = true,
  freelancerHasBalance = true,
  freelancerPreferredRequirementMet = true,
  arrowCrossPostingRequirementMet = true,
  premiumProjectEligibleStatus = true,
  premiumVerifiedProjectEligibleStatus = true,
  featuredPremiumProjectEligibleStatus = true,
  premiumBidAmountEligibleStatus = true,
}: GenerateBidRestrictionsOptions): FreelancerBidRestrictions {
  return {
    id: projectId,
    openForBidding,
    freelancerHasBalance,
    freelancerPreferredRequirementMet,
    arrowCrossPostingRequirementMet,
    premiumProjectEligible: {
      status: premiumProjectEligibleStatus,
      minimumReviewCount: 5,
      thresholdAmountUsd: 1500,
    },
    premiumVerifiedProjectEligible: {
      status: premiumVerifiedProjectEligibleStatus,
      thresholdAmountUsd: 3000,
    },
    featuredPremiumProjectEligible: {
      status: featuredPremiumProjectEligibleStatus,
      minimumReviewCount: 5,
    },
    premiumBidAmountEligible: {
      status: premiumBidAmountEligibleStatus,
      thresholdAmountUsd: 1500,
    },
  };
}
