import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchMyContacts } from './search-my-contacts.transformers';
import { SearchMyContactsCollection } from './search-my-contacts.types';

export function searchMyContactsReducer(
  state = {},
  action: CollectionActions<SearchMyContactsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'searchMyContacts') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchMyContactsCollection>(
          state,
          transformIntoDocuments(result, transformSearchMyContacts),
          order,
          ref,
        );
      }
      return state;
    default:
      return state;
  }
}
