import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { RoleApi } from 'api-typings/common/common';
import { EmployerReputationsRehireRatesCollection } from './employer-reputations-rehire-rates.types';

export function employerReputationsRehireRatesBackend(): Backend<
  EmployerReputationsRehireRatesCollection
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
        role: RoleApi.EMPLOYER,
        rehire_rates: 'true',
        project_stats: 'true',
        users: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
