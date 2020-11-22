import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { MembershipBenefitsCollection } from './membership-benefits.types';

export function membershipBenefitsBackend(): Backend<
  MembershipBenefitsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'memberships/0.1/benefits',
      params: {
        benefit_names: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
