import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ContestEngagementCollection } from './contest-engagement.types';

export function contestEngagementBackend(): Backend<
  ContestEngagementCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/getContestEngagementData.php',
      isGaf: true,
      params: {
        contest_ids: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
