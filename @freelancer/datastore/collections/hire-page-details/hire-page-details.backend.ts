import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { HirePageDetailsCollection } from './hire-page-details.types';

export function hirePageDetailsBackend(): Backend<HirePageDetailsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'hire-page/getHirePageDetails.php',
      isGaf: true,
      params: {
        skill: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
