import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { RoleApi } from 'api-typings/common/common';
import { FreelancerReputationsCollection } from './freelancer-reputations.types';

export function freelancerReputationsBackend(): Backend<
  FreelancerReputationsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/reputations',
      isGaf: false,
      params: {
        role: RoleApi.FREELANCER,
        users: ids || [],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
