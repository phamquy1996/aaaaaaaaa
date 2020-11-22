import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SimilarShowcasesCollection } from './similar-showcases.types';

export function similarShowcasesBackend(): Backend<SimilarShowcasesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'user-profile/similarShowcases.php',
      isGaf: true,
      params: {
        userIds: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
