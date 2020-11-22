import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestMessageThread } from './contest-messages.transformers';
import { ContestMessagesCollection } from './contest-messages.types';

export function contestMessagesReducer(
  state: CollectionStateSlice<ContestMessagesCollection> = {},
  action: CollectionActions<ContestMessagesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestMessages') {
        const { result, ref, order } = action.payload;
        if (result.threads) {
          return mergeDocuments<ContestMessagesCollection>(
            state,
            transformIntoDocuments(
              result.threads,
              transformContestMessageThread,
              result.users,
            ),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'contestMessages') {
        const { ref, result } = action.payload;

        const senderId = result.sender.id;
        const formattedResult = {
          threads: [{ message: result.message, replies: [] }],
          users: { [senderId]: result.sender },
        };

        return mergeWebsocketDocuments<ContestMessagesCollection>(
          state,
          transformIntoDocuments(
            formattedResult.threads,
            transformContestMessageThread,
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
