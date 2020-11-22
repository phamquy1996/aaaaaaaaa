import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchMyProjectsBuyerCollection } from './search-my-projects-buyer.types';

export function searchMyProjectsBuyerBackend(): Backend<
  SearchMyProjectsBuyerCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `search/myProjects.php`,
      isGaf: true,
      params: { buyer: 'true', active: 'true' },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
