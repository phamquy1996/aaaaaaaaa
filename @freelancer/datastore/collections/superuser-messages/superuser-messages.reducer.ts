import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMessage } from '../messages/messages.transformers';
import { SuperuserMessagesCollection } from './superuser-messages.types';

export function superuserMessagesReducer(
  state: CollectionStateSlice<SuperuserMessagesCollection> = {},
  action: CollectionActions<SuperuserMessagesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'superuserMessages') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SuperuserMessagesCollection>(
          state,
          transformIntoDocuments(result.messages, transformMessage),
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
