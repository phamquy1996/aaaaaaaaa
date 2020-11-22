import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ContestInviteCollection } from './contest-invite.types';

export function contestInviteBackend(): Backend<ContestInviteCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: undefined,
    push: (_, contestInvite) => ({
      endpoint: `contests/0.1/contests/${contestInvite.contestId}/invite`,
      isGaf: false,
      payload: {
        freelancer_id: contestInvite.freelancerId,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
