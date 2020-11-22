import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ExtraFeedPostContext } from './feed-posts.model';
import { FeedPostsCollection } from './feed-posts.types';

export function feedPostsBackend(): Backend<FeedPostsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `posts/0.1/posts`,
      isGaf: false,
      params: {
        post_ids: ids,
      },
    }),
    push: (authUid, post, extraContext?: ExtraFeedPostContext) => {
      if (!extraContext?.feedContextType) {
        throw new Error(
          'Missing required feedContextType field on create post.',
        );
      }
      if (!extraContext?.feedContextId) {
        throw new Error('Missing required feedContextId field on create post.');
      }

      const payload = {
        feed_context_id: extraContext.feedContextId,
        feed_context_type: extraContext.feedContextType,
        content: post.content,
        commenting_disabled: false,
        attachments: extraContext.attachments ? extraContext.attachments : [],
        entities: [],
      };

      return {
        endpoint: `feed/0.1/posts`,
        payload,
      };
    },
    set: undefined,
    update: (authUid, delta, original) => {
      if (!delta.id) {
        throw new Error('Missing post id.');
      }

      return {
        endpoint: `posts/0.1/posts/${delta.id}`,
        method: 'PUT',
        payload: {
          post_id: delta.id,
          content: delta.content,
          commenting_disabled: delta.commentingDisabled,
        },
      };
    },
    remove: undefined,
  };
}
