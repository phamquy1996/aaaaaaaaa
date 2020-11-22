import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  pluckDocumentFromRawStoreCollectionState,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCommentFeed } from './comment-feeds.transformers';
import { CommentFeedsCollection } from './comment-feeds.types';

export function commentFeedsReducer(
  state: CollectionStateSlice<CommentFeedsCollection> = {},
  action: CollectionActions<CommentFeedsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'commentFeeds') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CommentFeedsCollection>(
          state,
          transformIntoDocuments(result.comment_feeds, transformCommentFeed),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'commentFeeds') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<CommentFeedsCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformCommentFeed,
            ref.path.authUid,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'commentFeeds') {
        const { originalDocument, ref, result } = action.payload;
        const commentFeedId = originalDocument.id.toString();
        const commentFeed = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          commentFeedId,
        );
        if (!commentFeed) {
          throw new Error('Comment Feed being updated is missing from store.');
        }

        const resultCommentFeeds = transformIntoDocuments(
          result.comment_feeds.filter(feed => feed.id === originalDocument.id),
          transformCommentFeed,
          ref.path.authUid,
        );

        const resultCommentFeed = resultCommentFeeds.find(
          feed => feed.id === originalDocument.id,
        );

        if (!resultCommentFeed) {
          throw new Error('Comment Feed being updated is missing in response.');
        }

        return mergeWebsocketDocuments<CommentFeedsCollection>(
          state,
          [deepSpread(originalDocument, resultCommentFeed)],
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
          data.payload.payload.commentFeed
        ) {
          const ref: Reference<CommentFeedsCollection> = {
            path: {
              collection: 'commentFeeds',
              authUid: action.payload.toUserId,
            },
          };

          return mergeWebsocketDocuments<CommentFeedsCollection>(
            state,
            transformIntoDocuments(
              [data.payload.payload.commentFeed],
              transformCommentFeed,
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
