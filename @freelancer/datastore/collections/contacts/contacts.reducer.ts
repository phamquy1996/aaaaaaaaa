import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContact } from './contacts.transformers';
import { ContactsCollection } from './contacts.types';

export function contactsReducer(
  state: CollectionStateSlice<ContactsCollection> = {},
  action: CollectionActions<ContactsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contacts') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContactsCollection>(
          state,
          transformIntoDocuments(
            result.contacts,
            transformContact,
            ref.path.authUid,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
