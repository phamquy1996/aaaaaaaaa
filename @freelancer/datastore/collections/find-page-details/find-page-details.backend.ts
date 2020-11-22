import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { FindPageDetailsCollection } from './find-page-details.types';

export function findPageDetailsBackend(): Backend<FindPageDetailsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'find-page/getFindPageDetails.php',
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
