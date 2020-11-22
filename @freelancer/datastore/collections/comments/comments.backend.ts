import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { Comment } from './comments.model';
import { CommentsCollection } from './comments.types';

export function commentsBackend(): Backend<CommentsCollection> {
  return {
    defaultOrder: {
      field: 'timeCreated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `messages/0.1/comments/`,
      isGaf: false,
      params: {
        comment_ids: ids,
        comment_feed_ids: getQueryParamValue(query, 'threadId'),
      },
    }),
    push: (authUid, comment: Comment) => ({
      endpoint: `messages/0.1/comments/`,
      asFormData: true,
      payload: {
        comment: comment.comment || '',
        comment_feed_id: comment.threadId,
        source: comment.commentSource,
      },
    }),
    set: undefined,
    update: (authUid, delta, original) => ({
      endpoint: `messages/0.1/comments/${original.id}`,
      method: 'PUT',
      payload: {
        comment: delta.comment,
      },
    }),
    remove: undefined,
  };
}
