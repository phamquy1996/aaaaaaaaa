import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { RoleApi } from 'api-typings/common/common';
import { FreelancerReputationsRehireRatesCollection } from './freelancer-reputations-rehire-rates.types';

export function freelancerReputationsRehireRatesBackend(): Backend<
  FreelancerReputationsRehireRatesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    maxBatchSize: 1, // This endpoint only supports querying one document at a time

    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/reputations',
      isGaf: false,
      params: {
        role: RoleApi.FREELANCER,
        rehire_rates: 'true',
        users: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
