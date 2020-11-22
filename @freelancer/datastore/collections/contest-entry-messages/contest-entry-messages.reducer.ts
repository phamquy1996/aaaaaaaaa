import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformEntryMessageThread } from './contest-entry-messages.transformers';
import { ContestEntryMessagesCollection } from './contest-entry-messages.types';

export function contestEntryMessagesReducer(
  state: CollectionStateSlice<ContestEntryMessagesCollection> = {},
  action: CollectionActions<ContestEntryMessagesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestEntryMessages') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestEntryMessagesCollection>(
          state,
          transformIntoDocuments(
            result.threads,
            transformEntryMessageThread,
            result.users,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'contestEntryMessages') {
        const { ref, result } = action.payload;

        const senderId = result.sender.id;
        const formattedResult = {
          threads: [{ message: result.message, replies: [] }],
          users: { [senderId]: result.sender },
        };

        return mergeWebsocketDocuments<ContestEntryMessagesCollection>(
          state,
          transformIntoDocuments(
            formattedResult.threads,
            transformEntryMessageThread,
            formattedResult.users,
          ),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
