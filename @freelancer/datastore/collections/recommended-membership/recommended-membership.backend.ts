import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SubscriptionTypeApi } from 'api-typings/memberships/memberships_types';
import { RecommendedMembershipCollection } from './recommended-membership.types';

export function recommendedMembershipBackend(): Backend<
  RecommendedMembershipCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This is only ever for the current user so ordering doesn't matter.
    fetch: (authUid, ids, query, order) => ({
      endpoint: `memberships/getRecommendedMembership.php`,
      isGaf: true,
      params: {},
    }),
    push: (_, recommendedPackage) => {
      if (
        !recommendedPackage ||
        !recommendedPackage.prices ||
        (recommendedPackage.prices.length === 1 &&
          !recommendedPackage.prices[0])
      ) {
        throw new Error('Cannot subscribe without the package or its price');
      }

      const price = recommendedPackage.prices[0];
      return {
        endpoint: `memberships/0.1/packages/${recommendedPackage.id}`,
        asFormData: true,
        isGaf: false,
        payload: {
          action: SubscriptionTypeApi.SUBSCRIBE,
          auto_renew: true,
          contract_quantity: 1,
          currency: price.currencyId,
          duration_type: price.durationType,
          duration_cycle: price.durationCycle,
          is_trial: recommendedPackage.isTrial,
          quantity: 1,
        },
      };
    },
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
