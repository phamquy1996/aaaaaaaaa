import { DowngradeApi } from 'api-typings/memberships/memberships_types';
import { transformDuration } from '../membership-subscription-history/membership-subscription-history.transformers';
import { transformMembershipPackagePrice } from '../recommended-membership/recommended-membership.transformers';
import { MembershipDowngrade } from './membership-downgrades.model';

export function transformMembershipDowngrades(
  membershipDowngrade: DowngradeApi,
): MembershipDowngrade {
  if (membershipDowngrade.price === undefined) {
    throw ReferenceError('Price details missing from downgrade log');
  }

  return {
    id: membershipDowngrade.id,
    timeCreated: membershipDowngrade.time_created * 1000,
    status: membershipDowngrade.status,
    packageId: membershipDowngrade.package_id,
    duration: transformDuration(membershipDowngrade.duration),
    failureCount: membershipDowngrade.failure_count,
    autoRenew: membershipDowngrade.auto_renew,
    periodId: membershipDowngrade.period_id,
    quantity: membershipDowngrade.quantity,
    isTrial: membershipDowngrade.is_trial || false,
    price: transformMembershipPackagePrice(membershipDowngrade.price),
  };
}
