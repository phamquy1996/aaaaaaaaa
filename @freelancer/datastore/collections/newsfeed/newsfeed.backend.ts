import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { NewsfeedCollection } from './newsfeed.types';

export function newsfeedBackend(): Backend<NewsfeedCollection> {
  return {
    defaultOrder: {
      field: 'time',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `newsfeed/0.1/newsfeed`,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
