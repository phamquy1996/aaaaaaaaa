import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDeloitteSubscriberEmails } from './deloitte-subscriber-emails.transformers';
import { DeloitteSubscriberEmailsCollection } from './deloitte-subscriber-emails.types';

export function deloitteSubscriberEmailsReducer(
  state: CollectionStateSlice<DeloitteSubscriberEmailsCollection> = {},
  action: CollectionActions<DeloitteSubscriberEmailsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'deloitteSubscriberEmails') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<DeloitteSubscriberEmailsCollection>(
          state,
          transformIntoDocuments([result], transformDeloitteSubscriberEmails),
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
