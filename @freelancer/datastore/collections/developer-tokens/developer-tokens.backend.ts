import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { DeveloperTokensCollection } from './developer-tokens.types';

export function developerTokensBackend(): Backend<DeveloperTokensCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'users/0.1/self/bearer_tokens',
      isGaf: false,
      params: {},
    }),
    push: (authuid, object) => ({
      endpoint: 'users/0.1/self/bearer_tokens',
      isGaf: false,
      params: {},
      payload: {},
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
