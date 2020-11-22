import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { ParentContestComment } from './contest-comments.model';
import {
  transformContestComment,
  transformMessageApiToContestComment,
} from './contest-comments.transformers';
import { ContestCommentsCollection } from './contest-comments.types';

export function contestCommentsReducer(
  state: CollectionStateSlice<ContestCommentsCollection> = {},
  action: CollectionActions<ContestCommentsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestComments') {
        const { result, ref, order } = action.payload;
        if (result.comments) {
          return mergeDocuments<ContestCommentsCollection>(
            state,
            transformIntoDocuments(result.comments, transformContestComment),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'contestComments') {
        const { originalDocument, ref, result } = action.payload;

        return mergeWebsocketDocuments<ContestCommentsCollection>(
          state,
          transformIntoDocuments(
            [
              {
                ...result.comment,
                // FIXME: T180722 Remove this once API endpoint has been updated to
                // to return replies count
                replies_count: (originalDocument as ParentContestComment)
                  .repliesCount,
              },
            ],
            transformContestComment,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'contestComments') {
        const { ref, result } = action.payload;

        // The endpoint we use for posting new ContestComments is the old
        // ContestMessage endpoint, which returns in the type
        // MessageApi, so here we use transformMessageApiToContestComment
        return mergeWebsocketDocuments<ContestCommentsCollection>(
          state,
          transformIntoDocuments(
            [result.message],
            transformMessageApiToContestComment,
            result.sender.id,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'contestComments') {
        const { originalDocument, ref } = action.payload;

        return updateWebsocketDocuments<ContestCommentsCollection>(
          state,
          [originalDocument.id],
          _ => ({ ...originalDocument, isDeleted: true }),
          ref,
        );
      }
      return state;
    }

    // FIXME: T180433 Fix repliesCount and update method of
    // checking if comment is a parent comment
    case 'WS_MESSAGE': {
      if (
        action.payload.parent_type === 'notifications' &&
        [
          'contestCommentPosted',
          'contestCommentDeleted',
          'contestCommentUndeleted',
        ].includes(action.payload.type)
      ) {
        const ref: Reference<ContestCommentsCollection> = {
          path: {
            collection: 'contestComments',
            authUid: action.payload.toUserId,
          },
        };
        const { commentId, parentCommentId } = action.payload.data;

        switch (action.payload.type) {
          case 'contestCommentPosted': {
            return parentCommentId
              ? updateWebsocketDocuments<ContestCommentsCollection>(
                  state,
                  [parentCommentId],
                  comment => ({
                    ...comment,
                    repliesCount:
                      ((comment as ParentContestComment).repliesCount || 0) + 1,
                  }),
                  ref,
                )
              : state;
          }
          case 'contestCommentDeleted': {
            const initState = parentCommentId
              ? updateWebsocketDocuments<ContestCommentsCollection>(
                  state,
                  [parentCommentId],
                  comment => ({
                    ...comment,
                    repliesCount:
                      ((comment as ParentContestComment).repliesCount || 1) - 1,
                  }),
                  ref,
                )
              : state;

            return updateWebsocketDocuments<ContestCommentsCollection>(
              initState,
              [commentId],
              comment => ({ ...comment, isDeleted: true }),
              ref,
            );
          }
          case 'contestCommentUndeleted': {
            const initState = parentCommentId
              ? updateWebsocketDocuments<ContestCommentsCollection>(
                  state,
                  [parentCommentId],
                  comment => ({
                    ...comment,
                    repliesCount:
                      ((comment as ParentContestComment).repliesCount || 0) + 1,
                  }),
                  ref,
                )
              : state;

            return updateWebsocketDocuments<ContestCommentsCollection>(
              initState,
              [commentId],
              comment => ({ ...comment, isDeleted: false }),
              ref,
            );
          }
          default: {
            return state;
          }
        }
      }

      return state;
    }

    default:
      return state;
  }
}
