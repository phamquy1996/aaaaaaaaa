import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { TagsCollection } from './tags.types';

export function tagsBackend(): Backend<TagsCollection> {
  return {
    // TODO T75801: Add pagination and ordering to Tags API endpoint
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/tags/',
      params: {
        enabled: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
