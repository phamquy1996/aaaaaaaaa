import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { MembershipRenewalsCollection } from './membership-renewals.types';

export function membershipRenewalsBackend(): Backend<
  MembershipRenewalsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `memberships/0.1/renewals`,
      params: {
        package:
          query && query.searchQueryParams && query.searchQueryParams.packageId,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
