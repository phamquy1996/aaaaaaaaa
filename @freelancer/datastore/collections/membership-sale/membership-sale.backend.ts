import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { MembershipSaleCollection } from './membership-sale.types';

export function membershipSaleBackend(): Backend<MembershipSaleCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'memberships/sale.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
