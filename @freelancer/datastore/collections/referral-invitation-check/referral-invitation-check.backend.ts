import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ReferralInvitationCheckCollection } from './referral-invitation-check.types';

export function referralInvitationCheckBackend(): Backend<
  ReferralInvitationCheckCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: '/users/0.1/referral_invitations/check', // URL to hit
      isGaf: false, // This endpoint is an REST API.
      params: {
        bonus_id: 16,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
