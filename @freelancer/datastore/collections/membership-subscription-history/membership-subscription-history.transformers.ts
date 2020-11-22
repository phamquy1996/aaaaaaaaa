import { TimeUnitApi } from 'api-typings/common/common';
import {
  DurationApi,
  MembershipPeriodApi,
  SubscriptionHistoryLogApi,
} from 'api-typings/memberships/memberships_types';
import { MembershipPeriod } from '../membership-renewals/membership-renewals.model';
import { transformMembershipTrials } from '../membership-trials/membership-trials.transformers';
import { transformMembershipPackagePrice } from '../recommended-membership/recommended-membership.transformers';
import {
  Duration,
  MembershipSubscriptionHistory,
} from './membership-subscription-history.model';

export function transformMembershipSubscriptionHistory(
  subscriptionHistoryLog: SubscriptionHistoryLogApi,
): MembershipSubscriptionHistory {
  if (subscriptionHistoryLog.price === undefined) {
    throw ReferenceError('Price details missing from history log');
  }

  if (subscriptionHistoryLog.period === undefined) {
    throw ReferenceError('Period details missing from history log');
  }

  return {
    id: subscriptionHistoryLog.id,
    packageId: subscriptionHistoryLog.package_id,
    timeStarted: subscriptionHistoryLog.time_started * 1000,
    timeEndedActual: subscriptionHistoryLog.time_ended_actual
      ? subscriptionHistoryLog.time_ended_actual * 1000
      : subscriptionHistoryLog.time_ended_actual,
    timeEndedExpected: subscriptionHistoryLog.time_ended_expected * 1000,
    priceId: subscriptionHistoryLog.price_id,
    periodId: subscriptionHistoryLog.period_id,
    status: subscriptionHistoryLog.status,
    userId: subscriptionHistoryLog.user_id,
    quantity: subscriptionHistoryLog.quantity,
    lastPaidTransactionId: subscriptionHistoryLog.last_paid_transaction_id,
    isTrial: subscriptionHistoryLog.is_trial,
    duration: transformDuration(subscriptionHistoryLog.duration),
    trial:
      subscriptionHistoryLog.trial &&
      transformMembershipTrials(subscriptionHistoryLog.trial),
    trialPrice:
      subscriptionHistoryLog.trial_price &&
      transformMembershipPackagePrice(subscriptionHistoryLog.trial_price),
    price: transformMembershipPackagePrice(subscriptionHistoryLog.price),
    period: transformMembershipPeriod(subscriptionHistoryLog.period),
  };
}

export function transformMembershipPeriod(
  membershipPeriod: MembershipPeriodApi,
): MembershipPeriod {
  return {
    id: membershipPeriod.id,
    packageId: membershipPeriod.package_id,
    userId: membershipPeriod.user_id,
    timeStarted: membershipPeriod.time_started * 1000,
    timeEnded: membershipPeriod.time_ended
      ? membershipPeriod.time_ended * 1000
      : undefined,
  };
}

export function transformDuration(duration: DurationApi): Duration {
  return {
    id: duration.id,
    type: duration.type || TimeUnitApi.MONTH,
    cycle: duration.cycle || 1,
  };
}
