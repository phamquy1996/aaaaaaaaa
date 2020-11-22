import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import {
  CommentFeedUpdateActionType,
  CommentFeedUpdatePayload,
} from './comment-feeds.backend-model';
import { CommentFeed } from './comment-feeds.model';
import { CommentFeedsCollection } from './comment-feeds.types';

export function commentFeedsBackend(): Backend<CommentFeedsCollection> {
  return {
    defaultOrder: {
      field: 'timeUpdated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `messages/0.1/comment_feeds/`,
      isGaf: false,
      params: {
        context_ids: getQueryParamValue(query, 'contextId'),
        context_type: getQueryParamValue(query, 'contextType')[0],
      },
    }),
    push: (authUid, commentFeed: CommentFeed) => ({
      endpoint: `messages/0.1/comment_feeds/`,
      asFormData: true,
      payload: {
        context_id: commentFeed.contextId,
        context_type: commentFeed.contextType,
        comment: (commentFeed.comment && commentFeed.comment.comment) || '',
        source: commentFeed.comment && commentFeed.comment.commentSource,
      },
    }),
    set: undefined,
    update: (authUid, commentFeed, originalCommentFeed) => {
      let payload: CommentFeedUpdatePayload | undefined;

      if (commentFeed.timeRead !== undefined) {
        payload = {
          comment_feeds: [originalCommentFeed.id],
          action: CommentFeedUpdateActionType.READ,
        };
      }

      if (!payload) {
        throw new Error('Update payload is empty.');
      }

      return {
        endpoint: 'messages/0.1/comment_feeds/',
        asFormData: true,
        payload,
        method: 'PUT',
      };
    },
    remove: undefined,
  };
}
