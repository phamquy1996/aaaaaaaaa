import { RenewalApi } from 'api-typings/memberships/memberships_types';
import {
  transformDuration,
  transformMembershipPeriod,
} from '../membership-subscription-history/membership-subscription-history.transformers';
import { MembershipRenewal } from './membership-renewals.model';

export function transformMembershipRenewal(
  membershipRenewal: RenewalApi,
): MembershipRenewal {
  return {
    id: membershipRenewal.id,
    period: transformMembershipPeriod(membershipRenewal.period),
    timeOptedIn: membershipRenewal.time_opted_in * 1000,
    timeOptedOut: membershipRenewal.time_opted_out
      ? membershipRenewal.time_opted_out * 1000
      : undefined,
    duration: transformDuration(membershipRenewal.duration),
    failureCount: membershipRenewal.failure_count,
  };
}
