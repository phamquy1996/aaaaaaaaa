import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { FeedCollection } from '../feed/feed.types';
import { Post } from './feed-posts.model';
import { transformFeedPost } from './feed-posts.transformers';
import { FeedPostsCollection } from './feed-posts.types';

export function feedPostsReducer(
  state: CollectionStateSlice<FeedPostsCollection> = {},
  action: CollectionActions<FeedPostsCollection | FeedCollection>,
) {
  switch (action.type) {
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'feedPosts') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<FeedPostsCollection>(
          state,
          transformIntoDocuments([result.post], transformFeedPost),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'feed') {
        const { result, ref } = action.payload;
        if (!result.feed_item.reference_id) {
          throw new Error('Reference id was not provided!');
        }

        return updateWebsocketDocuments<FeedPostsCollection>(
          state,
          [result.feed_item.reference_id],
          (post: Post) => ({
            ...post,
            isDeleted: true,
            deleted: result.feed_item.deleted
              ? result.feed_item.deleted * 1000
              : undefined,
          }),
          {
            path: {
              collection: 'feedPosts',
              authUid: ref.path.authUid,
            },
          },
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'feedPosts') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<FeedPostsCollection>(
          state,
          transformIntoDocuments([result.post], transformFeedPost),
          ref,
        );
      }
      return state;
    }

    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'feedPosts') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<FeedPostsCollection>(
          state,
          transformIntoDocuments(result.posts, transformFeedPost),
          order,
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      if (action.payload.type === 'resource') {
        const { data } = action.payload;
        if (
          data.payload.updateType === 'post.create' &&
          data.payload.payload.post
        ) {
          const ref: Reference<FeedPostsCollection> = {
            path: {
              collection: 'feedPosts',
              authUid: action.payload.toUserId,
            },
          };

          return mergeWebsocketDocuments<FeedPostsCollection>(
            state,
            transformIntoDocuments(
              [data.payload.payload.post],
              transformFeedPost,
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
