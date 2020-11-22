import { isDefined, toNumber } from '@freelancer/utils';
import {
  SubscriptionResultApi,
  SubscriptionTypeApi,
} from 'api-typings/memberships/memberships_types';
import {
  MembershipSubscription,
  MembershipSubscriptionResult,
} from './membership-subscription.model';

export function transformMembershipSubscription(
  result: SubscriptionResultApi,
  authId: string,
): MembershipSubscription {
  if (!isDefined(result.type)) {
    throw new ReferenceError("Field 'type' is missing from the result");
  }

  if (!isDefined(result.period_id)) {
    throw new ReferenceError("Field 'period_id' is missing from the result");
  }

  let subscriptionResult: MembershipSubscriptionResult;
  switch (result.type) {
    case SubscriptionTypeApi.DOWNGRADE:
      subscriptionResult = {
        periodId: result.period_id,
        type: result.type,
      };
      break;
    default:
      if (!isDefined(result.history_log_id)) {
        throw new ReferenceError(
          "Field 'history_log_id' is missing from the result",
        );
      }
      subscriptionResult = {
        periodId: result.period_id,
        historyLogId: result.history_log_id,
        type: result.type,
      };
      break;
  }

  return {
    id: toNumber(authId),
    result: subscriptionResult,
  };
}
