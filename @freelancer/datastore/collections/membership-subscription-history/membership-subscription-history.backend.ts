import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SubscriptionStatusApi } from 'api-typings/memberships/memberships_types';
import { MembershipSubscriptionHistoryCollection } from './membership-subscription-history.types';

export function membershipSubscriptionHistoryBackend(): Backend<
  MembershipSubscriptionHistoryCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'memberships/0.1/history_logs/',
      isGaf: false,
      params: {
        statuses: [SubscriptionStatusApi.ACTIVE],
        period_details: true,
        price_details: true,
        trial_details: true,
      },
    }),
    push: undefined,
    set: undefined,
    /**
     * This action seems to fit better in MembershipRenewalsCollection.
     * However, this PUT endpoint acts as a helper to automatically manage
     * renewals of a current ManageSubscriptionHistory based on its package ID.
     * auto_renew=true
     *   Creates a new renewal entry for the current subscription's period.
     * auto_renew=false
     *   Opts out of the renewal entry for the current subscription's period.
     */
    update: (authUid, delta, log) => ({
      endpoint: `memberships/0.1/renewals`,
      method: 'PUT',
      asFormData: true,
      payload: {
        package: log.packageId,
        auto_renew: !!delta.autoRenew,
      },
    }),
    remove: undefined,
  };
}
