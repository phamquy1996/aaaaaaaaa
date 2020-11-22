import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ProjectBidInfoCollection } from './project-bid-info.types';

export function projectBidInfoBackend(): Backend<ProjectBidInfoCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      // FIXME: This won't work with batching
      endpoint: `projects/0.1/projects/${ids}/bidinfo`,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
