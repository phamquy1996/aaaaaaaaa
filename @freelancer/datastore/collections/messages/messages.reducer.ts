import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Path,
  pluckDocumentFromRawStoreCollectionState,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { SourceTypeApi } from 'api-typings/messages/messages_types';
import { MessageSendStatus } from './messages.model';
import {
  transformMessage,
  transformWebsocketMessage,
} from './messages.transformers';
import { MessagesCollection } from './messages.types';

export function messagesReducer(
  state: CollectionStateSlice<MessagesCollection> = {},
  action: CollectionActions<MessagesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'messages') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MessagesCollection>(
          state,
          transformIntoDocuments(result.messages, transformMessage),
          order,
          ref,
        );
      }
      return state;

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'messages') {
        const { result: rawMessage, ref } = action.payload;
        return mergeWebsocketDocuments<MessagesCollection>(
          state,
          transformIntoDocuments([rawMessage], transformMessage),
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const { payload } = action;
      if (payload.parent_type === 'messages' && payload.type === 'private') {
        const path: Path<MessagesCollection> = {
          collection: 'messages',
          authUid: payload.toUserId,
        };
        const ref = { path };
        return mergeWebsocketDocuments<MessagesCollection>(
          state,
          transformIntoDocuments([payload], transformWebsocketMessage),
          ref,
        );
      }
      if (payload.parent_type === 'messages' && payload.type === 'attach') {
        const path: Path<MessagesCollection> = {
          collection: 'messages',
          authUid: payload.toUserId,
        };
        const messageId = payload.data.message_id;
        const ref = { path };
        return mergeWebsocketDocuments<MessagesCollection>(
          state,
          transformIntoDocuments(
            [payload.data.thread_id],
            (threadId: number) => {
              const message = pluckDocumentFromRawStoreCollectionState(
                state,
                path,
                messageId,
              );
              return message
                ? {
                    ...message,
                    attachments: [
                      ...(message.attachments || []),
                      ...payload.data.filenames,
                    ],
                  }
                : {
                    id: payload.data.message_id,
                    attachments: payload.data.filenames,
                    fromUser: payload.data.from_user,
                    message: '',
                    messageSource: 'chat_box' as SourceTypeApi,
                    threadId: payload.data.thread_id,
                    timeCreated: payload.timestamp,
                    sendStatus: MessageSendStatus.SENT,
                  };
            },
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
