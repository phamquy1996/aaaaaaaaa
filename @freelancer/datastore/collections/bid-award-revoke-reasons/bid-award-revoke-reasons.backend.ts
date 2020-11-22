import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { BidAwardRevokeReasonsCollection } from './bid-award-revoke-reasons.types';

export function bidAwardRevokeReasonsBackend(): Backend<
  BidAwardRevokeReasonsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'buyer/getBidAwardRevokeReasons.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
