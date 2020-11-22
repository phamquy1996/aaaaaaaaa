import { isNumeric } from '@freelancer/utils';
import {
  ContextTypeApi,
  ThreadApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import { transformComment } from '../comments/comments.transformers';
import { CommentFeed } from './comment-feeds.model';

export function transformCommentFeed(commentFeed: ThreadApi): CommentFeed {
  const baseCommentFeed = commentFeed.thread;

  if (!baseCommentFeed.id) {
    throw new Error('Comment feeds should have an id');
  }

  if (!baseCommentFeed.context) {
    throw new Error('Comment feeds should have a context');
  }

  if (
    !baseCommentFeed.context.id ||
    !baseCommentFeed.context.type ||
    baseCommentFeed.context.type !== ContextTypeApi.POST
  ) {
    throw new Error('Comment feeds should have valid context');
  }

  if (!baseCommentFeed.owner) {
    throw new Error('Comment feeds should have a owner');
  }

  if (baseCommentFeed.thread_type !== ThreadTypeApi.COMMENT_FEED) {
    throw new Error('Comment feeds should be of thread type comment feed');
  }

  return {
    id: commentFeed.id,
    contextId: baseCommentFeed.context.id,
    contextType: baseCommentFeed.context.type,
    members: baseCommentFeed.members || [],
    comment: baseCommentFeed.message
      ? transformComment(baseCommentFeed.message)
      : undefined,
    owner: baseCommentFeed.owner,
    threadType: baseCommentFeed.thread_type,
    timeCreated: (baseCommentFeed.time_created || 0) * 1000,
    timeUpdated: (commentFeed.time_updated || 0) * 1000,
    // Time Read can be:
    // - 0 if user is a part of comment feed but haven't seen it yet
    // - undefined if user is not a part of the comment feed
    // - timestamp if user is a part of a comment feed and seen it
    timeRead:
      commentFeed.time_read !== undefined && isNumeric(commentFeed.time_read)
        ? commentFeed.time_read * 1000
        : undefined,
  };
}
