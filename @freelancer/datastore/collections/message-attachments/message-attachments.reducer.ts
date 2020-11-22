import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  mergeWebsocketDocuments,
  Path,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMessageAttachment } from './message-attachments.transformers';
import { MessageAttachmentsCollection } from './message-attachments.types';

export function messageAttachmentsReducer(
  state: CollectionStateSlice<MessageAttachmentsCollection> = {},
  action: CollectionActions<MessageAttachmentsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'messageAttachments') {
        const { result, ref, order } = action.payload;
        const threadId = getQueryParamValue(ref.query, 'threadId')[0];
        return mergeDocuments<MessageAttachmentsCollection>(
          state,
          transformIntoDocuments(
            result.attachments,
            transformMessageAttachment,
            threadId,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const { payload } = action;
      if (payload.parent_type === 'messages' && payload.type === 'attach') {
        const userId = payload.toUserId;
        const path: Path<MessageAttachmentsCollection> = {
          collection: 'messageAttachments',
          authUid: userId,
        };
        const ref = { path };
        return mergeWebsocketDocuments<MessageAttachmentsCollection>(
          state,
          transformIntoDocuments(payload.data.attachments, attachment => ({
            id: attachment.attachment_id,
            threadId: payload.data.thread_id,
            messageId: payload.data.message_id,
            timeCreated: payload.data.time_created * 1000,
            filename: attachment.filename,
          })),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
