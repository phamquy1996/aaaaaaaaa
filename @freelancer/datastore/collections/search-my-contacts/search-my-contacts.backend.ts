import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SearchMyContactsCollection } from './search-my-contacts.types';

export function searchMyContactsBackend(): Backend<SearchMyContactsCollection> {
  return {
    defaultOrder: {
      field: 'won',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `search/myContacts.php`,
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
