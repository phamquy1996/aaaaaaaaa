import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ContactsCollection } from './contacts.types';

export function contactsBackend(): Backend<ContactsCollection> {
  return {
    defaultOrder: {
      field: 'maxWeight',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `contacts/0.1/contacts`,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
