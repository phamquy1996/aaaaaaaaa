import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { MembershipSubscriptionCollection } from './membership-subscription.types';

export function membershipSubscriptionBackend(): Backend<
  MembershipSubscriptionCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: undefined,
    push: (authId, { request }) => {
      if (!isDefined(request)) {
        throw new Error('Request payload is missing');
      }

      return {
        endpoint: `memberships/0.1/packages/${request.packageId}/?action=${request.action}`,
        payload: {
          package_id: request.packageId,
          duration_type: request.durationType,
          duration_cycle: request.durationCycle,
          quantity: request.quantity,
          auto_renew: request.autoRenew,
          currency_id: request.currencyId,
          coupon: request.coupon,
          is_trial: request.isTrial,
          trial_id: request.trialId,
          contract_quantity: request.contractQuantity,
        },
        asFormData: true,
      };
    },
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
