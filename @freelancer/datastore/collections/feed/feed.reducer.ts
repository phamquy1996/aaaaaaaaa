import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { FeedPostsCollection } from '../feed-posts/feed-posts.types';
import { transformFeedItem } from './feed.transformers';
import { FeedCollection } from './feed.types';

export function feedReducer(
  state: CollectionStateSlice<FeedCollection> = {},
  action: CollectionActions<FeedCollection | FeedPostsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'feed') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<FeedCollection>(
          state,
          transformIntoDocuments(result.feed, transformFeedItem),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'feedPosts') {
        const { result } = action.payload;
        const ref: Reference<FeedCollection> = {
          path: {
            collection: 'feed',
            authUid: action.payload.ref.path.authUid,
          },
        };
        return mergeWebsocketDocuments<FeedCollection>(
          state,
          transformIntoDocuments([result.feed_item], transformFeedItem),
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
          data.payload.payload.feedItem &&
          data.payload.payload.ownerUserId &&
          // Check this as we don't want to merge it for post owner
          data.payload.payload.ownerUserId.toString() !==
            action.payload.toUserId
        ) {
          const ref: Reference<FeedCollection> = {
            path: {
              collection: 'feed',
              authUid: action.payload.toUserId,
            },
          };

          return mergeWebsocketDocuments<FeedCollection>(
            state,
            transformIntoDocuments(
              [data.payload.payload.feedItem],
              transformFeedItem,
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
