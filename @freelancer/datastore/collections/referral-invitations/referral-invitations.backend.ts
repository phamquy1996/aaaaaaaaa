import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ReferralInvitationsCollection } from './referral-invitations.types';

export function referralInvitationsBackend(): Backend<
  ReferralInvitationsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/referral_invitations/',
      params: { bonus_id: 16 },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
