import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformComment } from './comments.transformers';
import { CommentsCollection } from './comments.types';

export function commentsReducer(
  state: CollectionStateSlice<CommentsCollection> = {},
  action: CollectionActions<CommentsCollection>,
) {
  switch (action.type) {
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'comments') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<CommentsCollection>(
          state,
          transformIntoDocuments([result.comment], transformComment),
          ref,
        );
      }
      return state;
    }

    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'comments') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CommentsCollection>(
          state,
          transformIntoDocuments(result.comments, transformComment),
          order,
          ref,
        );
      }
      return state;

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'comments') {
        const { result: rawMessage, ref } = action.payload;
        return mergeWebsocketDocuments<CommentsCollection>(
          state,
          transformIntoDocuments([rawMessage], transformComment),
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      if (action.payload.type === 'resource') {
        const { data } = action.payload;
        if (
          (data.payload.updateType === 'comment.create' ||
            data.payload.updateType === 'comment.update') &&
          data.payload.payload.commentFeed.thread.message
        ) {
          const ref: Reference<CommentsCollection> = {
            path: {
              collection: 'comments',
              authUid: action.payload.toUserId,
            },
          };

          return mergeWebsocketDocuments<CommentsCollection>(
            state,
            transformIntoDocuments(
              [data.payload.payload.commentFeed.thread.message],
              transformComment,
            ),
            ref,
          );
        }
      }
      return state;
    }

    default:
      return state;
  }
}
