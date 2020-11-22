import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserBidLimitCollection } from './user-bid-limit.types';

export function userBidLimitBackend(): Backend<UserBidLimitCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/getBidLimit.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
