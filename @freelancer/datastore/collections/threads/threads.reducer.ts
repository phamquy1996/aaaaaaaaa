import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  Path,
  pluckDocumentFromRawStoreCollectionState,
  removeDocumentById,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { FolderApi } from 'api-typings/messages/messages_types';
import { Message, MessageSendStatus } from '../messages/messages.model';
import { transformThread } from './threads.transformers';
import { ThreadsCollection } from './threads.types';

export function threadsReducer(
  state: CollectionStateSlice<ThreadsCollection> = {},
  action: CollectionActions<ThreadsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'threads') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ThreadsCollection>(
          state,
          transformIntoDocuments(
            result.threads,
            transformThread,
            ref.path.authUid,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'threads') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<ThreadsCollection>(
          state,
          transformIntoDocuments([result], transformThread, ref.path.authUid),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE': {
      if (action.payload.type === 'threads') {
        const { delta, originalDocument, ref } = action.payload;
        const threadId = originalDocument.id.toString();
        const thread = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          threadId,
        );
        if (!thread) {
          throw new Error('Thread being updated is missing in the store');
        }
        return mergeWebsocketDocuments<ThreadsCollection>(
          state,
          transformIntoDocuments([threadId], _ => {
            if (delta.folder) {
              const folder: FolderApi = delta.folder || 'inbox';
              return { ...thread, folder };
            }
            if (delta.isRead) {
              return { ...thread, messageUnreadCount: 0, isRead: true };
            }
            return thread;
          }),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'threads') {
        const { delta, originalDocument, ref, rawRequest } = action.payload;
        if ('action' in rawRequest && rawRequest.action === 'add') {
          /*
           * We can't rely on the thread ID of the original object here as in case
           * of new group thread creation the original object is the thread we
           * initiated the group thread creation from. What we need here is the
           * new thread returned in the result.
           */
          return mergeWebsocketDocuments<ThreadsCollection>(
            state,
            transformIntoDocuments(
              [action.payload.result],
              transformThread,
              ref.path.authUid,
            ),
            ref,
          );
        }
        const threadId = originalDocument.id.toString();
        const thread = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          threadId,
        );
        if (!thread) {
          throw new Error('Thread being updated is missing in the store');
        }
        return mergeWebsocketDocuments<ThreadsCollection>(
          state,
          transformIntoDocuments([threadId], _ => deepSpread(thread, delta)),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_ERROR': {
      if (action.payload.type === 'threads') {
        const { delta, originalDocument, ref } = action.payload;
        const threadId = originalDocument.id.toString();
        const thread = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          threadId,
        );
        if (!thread) {
          throw new Error('Thread being updated is missing in the store');
        }
        return mergeWebsocketDocuments<ThreadsCollection>(
          state,
          transformIntoDocuments([threadId], _ => ({
            ...thread,
            ...(delta.folder
              ? { folder: originalDocument.folder || 'inbox' }
              : {}),
          })),
          ref,
        );
      }
      return state;
    }

    // TODO T37442 consider pulling this out somewhere else
    case 'WS_MESSAGE': {
      const { payload } = action;
      const userId = payload.toUserId;
      const path: Path<ThreadsCollection> = {
        collection: 'threads',
        authUid: userId,
      };
      const ref = { path };
      if (
        payload.parent_type === 'messages' &&
        (payload.type === 'user_read' || payload.type === 'typing')
      ) {
        const fromUserId =
          payload.type === 'user_read'
            ? payload.data.user_id
            : payload.data.from_user;
        const threadIds =
          payload.type === 'user_read'
            ? payload.data.thread_ids
            : [payload.data.thread];

        if (fromUserId === toNumber(userId)) {
          return updateWebsocketDocuments<ThreadsCollection>(
            state,
            payload.type === 'user_read'
              ? payload.data.thread_ids
              : [payload.data.thread],
            thread => ({ ...thread, messageUnreadCount: 0 }),
            ref,
          );
        }
        return updateWebsocketDocuments<ThreadsCollection>(
          state,
          threadIds,
          thread => ({
            ...thread,
            userReadTimes: {
              ...thread.userReadTimes,
              [fromUserId]: Date.now(),
            },
          }),
          ref,
        );
      }
      if (
        payload.parent_type === 'messages' &&
        payload.type === 'write_privacy_update'
      ) {
        return updateWebsocketDocuments<ThreadsCollection>(
          state,
          payload.data.thread_ids,
          thread => ({ ...thread, writePrivacy: payload.data.write_privacy }),
          ref,
        );
      }
      if (payload.parent_type === 'messages' && payload.type === 'private') {
        return updateWebsocketDocuments<ThreadsCollection>(
          state,
          [payload.data.thread_id],
          thread => {
            // FIXME: This should fetch if the thread isn't there
            const newMessage: Message = {
              attachments: payload.data.attachments,
              fromUser: payload.data.from_user,
              id: payload.data.id,
              message: payload.data.message,
              messageSource: payload.data.message_source,
              threadId: payload.data.thread_id,
              timeCreated: payload.data.time_created * 1000, // Turn seconds to ms
              sendStatus: MessageSendStatus.SENT,
            };

            const messageUnreadCount =
              payload.data.from_user === toNumber(payload.toUserId)
                ? 0
                : thread.messageUnreadCount + 1;

            return {
              ...thread,
              message: newMessage,
              messageUnreadCount,
              isRead: messageUnreadCount === 0,
              timeUpdated: newMessage.timeCreated,
              userReadTimes: {
                ...thread.userReadTimes,
                [payload.data.from_user]: newMessage.timeCreated,
              },
            };
          },
          ref,
        );
      }
      if (
        payload.parent_type === 'notifications' &&
        payload.type === 'groupchat'
      ) {
        const { members: membersDelta } = payload.data.payload;
        const thread = pluckDocumentFromRawStoreCollectionState(
          state,
          path,
          payload.data.payload.thread,
        );
        if (!thread) {
          return state;
        }
        const members =
          payload.data.action === 'add'
            ? [...thread.members, ...membersDelta]
            : thread.members.filter(u => !membersDelta.includes(u));
        const otherMembers = members.filter(
          u => u !== toNumber(payload.toUserId),
        );
        const inactiveMembers =
          payload.data.action === 'add'
            ? thread.inactiveMembers.filter(u => !membersDelta.includes(u))
            : [...thread.inactiveMembers, ...membersDelta];

        if (members.includes(toNumber(payload.toUserId))) {
          // Current user is still in thread, update it.
          return addWebsocketDocuments(
            state,
            [payload.data.payload.thread],
            threadId => ({
              ...thread,
              members,
              otherMembers,
              inactiveMembers,
            }),
            ref,
          );
        }
        // Current user was removed from thread, remove it.
        return removeDocumentById<ThreadsCollection>(
          ref,
          state,
          payload.data.payload.thread,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
