import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchHistoryCollection } from './search-history.types';

export function searchHistoryBackend(): Backend<SearchHistoryCollection> {
  return {
    defaultOrder: {
      field: 'timestamp',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `search/history.php`,
      isGaf: true,
      params: {},
    }),
    push: (_, data) => ({
      endpoint: `search/history.php`,
      isGaf: true,
      payload: {
        keyword: data.keyword,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
