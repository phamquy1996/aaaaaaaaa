import {
  PackageBenefitApi,
  PackagePriceApi,
} from 'api-typings/memberships/memberships_types';
import { RecommendedMembershipPackageApi } from './recommended-membership.backend-model';
import {
  MembershipPackageBenefit,
  MembershipPackagePrice,
  RecommendedMembershipPackage,
} from './recommended-membership.model';

export function transformRecommendedMembershipPackage(
  recommendedMembershipPackage: RecommendedMembershipPackageApi,
): RecommendedMembershipPackage {
  return {
    id: recommendedMembershipPackage.id,
    benefits: recommendedMembershipPackage.benefits
      ? recommendedMembershipPackage.benefits.map(
          transformMembershipPackageBenefit,
        )
      : undefined,
    categoryId: recommendedMembershipPackage.category_id,
    currencyDetails: recommendedMembershipPackage.currencyDetails,
    displayName: recommendedMembershipPackage.display_name,
    displayNameFirstUpper:
      recommendedMembershipPackage.display_name_first_upper,
    displayPrice: recommendedMembershipPackage.displayPrice,
    enabled: recommendedMembershipPackage.enabled,
    internalName: recommendedMembershipPackage.internal_name,
    isAnnual: recommendedMembershipPackage.isAnnual || false,
    isMonthly: recommendedMembershipPackage.isMonthly || false,
    isTrial: recommendedMembershipPackage.is_trial,
    level: recommendedMembershipPackage.level,
    monthlyPrice: recommendedMembershipPackage.monthlyPrice,
    monthlyPriceDecimalPart:
      recommendedMembershipPackage.monthlyPriceDecimalPart,
    monthlyPriceIntegerPart:
      recommendedMembershipPackage.monthlyPriceIntegerPart,
    priceAfterTax: recommendedMembershipPackage.priceAfterTax,
    prices: recommendedMembershipPackage.prices
      ? recommendedMembershipPackage.prices.map(transformMembershipPackagePrice)
      : undefined,
    order: recommendedMembershipPackage.order,
    taxName: recommendedMembershipPackage.taxName,
    trialDuration: recommendedMembershipPackage.trial_duration,
    trialId: recommendedMembershipPackage.trial_id,
    trialLandingUrl: recommendedMembershipPackage.trial_landing_url,
    trialType: recommendedMembershipPackage.trial_type,
    upperName: recommendedMembershipPackage.upper_name,
    withTax: recommendedMembershipPackage.withTax,
  };
}

export function transformMembershipPackageBenefit(
  packageBenefit: PackageBenefitApi,
): MembershipPackageBenefit {
  return {
    id: packageBenefit.id,
    benefit: transformMembershipBenefit(packageBenefit),
    benefitValue: packageBenefit.benefit_value,
    packageId: packageBenefit.package_id,
  };
}

function transformMembershipBenefit(packageBenefit: PackageBenefitApi) {
  return {
    id: packageBenefit.benefit.id,
    value: packageBenefit.benefit.value,
    displayName: packageBenefit.benefit.display_name,
    internalName: packageBenefit.benefit.internal_name,
    duplicateRule: packageBenefit.benefit.duplicate_rule,
    packageInternalName: packageBenefit.benefit.package_internal_name,
  };
}

export function transformMembershipPackagePrice(
  packagePrice: PackagePriceApi,
): MembershipPackagePrice {
  return {
    id: packagePrice.price_id,
    amount: packagePrice.amount,
    coupon: packagePrice.coupon,
    contractQuantity: packagePrice.contract_quantity,
    currencyId: packagePrice.currency_id,
    durationId: packagePrice.duration.id,
    durationType: packagePrice.duration.type,
    durationCycle: packagePrice.duration.cycle,
    packageId: packagePrice.package_id,
    timeValidStart: packagePrice.time_valid_start * 1000,
    timeValidEnd: packagePrice.time_valid_end
      ? packagePrice.time_valid_end * 1000
      : undefined,
  };
}
