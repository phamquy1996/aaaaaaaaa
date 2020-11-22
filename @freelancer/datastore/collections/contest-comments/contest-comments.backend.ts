import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import {
  ContestCommentContextTypeApi,
  MessageBoardApi,
} from 'api-typings/contests/contests';
import { ContestCommentUpdateAction } from './contest-comments.backend-model';
import { ParentContestComment } from './contest-comments.model';
import { ContestCommentsCollection } from './contest-comments.types';

export function contestCommentsBackend(): Backend<ContestCommentsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => {
      const parentId = getQueryParamValue(query, 'parentId')[0];
      const contextId = getQueryParamValue(query, 'contextId')[0];
      const contextType = getQueryParamValue(query, 'contextType')[0];

      if (!parentId && !contextId) {
        throw new Error('Missing contextID when trying to fetch comments');
      }

      if (!parentId && !contextType) {
        throw new Error('Missing contextType when trying to fetch comments');
      }

      const endpoint = parentId
        ? `contests/0.1/comments/${parentId}/replies/`
        : `contests/0.1/comments/`;

      const params = parentId
        ? {}
        : {
            reply_details: 'true',
            context_type: contextType,
            context_id: contextId,
          };

      return {
        endpoint,
        isGaf: false,
        params,
      };
    },
    push: (_, comment) => {
      // We're using the old CommentMessages API endpoint to push new comments.
      // For contest comments, use CVP Message Board.
      // For entry comments and annotations, use Entry Message Board.
      let board;
      let entryId;
      let fileId;
      let xCoordinate;
      let yCoordinate;

      switch (comment.contextType) {
        case ContestCommentContextTypeApi.CONTEST: {
          board = MessageBoardApi.CVP;
          break;
        }
        case ContestCommentContextTypeApi.ANNOTATION: {
          const annotation = comment as ParentContestComment;
          board = MessageBoardApi.ENTRY;
          fileId = annotation.contextId;
          entryId =
            annotation.extraForPost && annotation.extraForPost.entryId
              ? annotation.extraForPost.entryId
              : null;

          if (!entryId) {
            throw new Error('Missing entryId when trying to post comment');
          }

          if (
            !annotation.annotationDetails?.coordinates.x ||
            !annotation.annotationDetails?.coordinates.y
          ) {
            throw new Error(
              'Missing at least one of the required parameters for posting an annotation: xCoordinate, yCoordinate',
            );
          }

          xCoordinate = annotation.annotationDetails?.coordinates.x;
          yCoordinate = annotation.annotationDetails?.coordinates.y;

          break;
        }
        case ContestCommentContextTypeApi.ENTRY: {
          board = MessageBoardApi.ENTRY;
          entryId = comment.contextId;
          break;
        }
        default:
          throw new Error('Invalid context type');
      }

      if (!comment.extraForPost || !comment.extraForPost.contestId) {
        throw new Error(
          'Missing extraForPost.contestId when trying to post comment',
        );
      }

      const { contestId } = comment.extraForPost;

      return {
        endpoint: 'contests/0.1/messages/',
        method: 'POST',
        payload: {
          board,
          comment: comment.comment,
          contest_id: contestId,
          entry_id: entryId,
          parent_id: comment.parentId,
          x_coordinate: xCoordinate,
          y_coordinate: yCoordinate,
          file_id: fileId,
        },
      };
    },
    set: undefined,
    update: (authUid, comment, originalComment) => {
      let payload;

      if (!comment.isDeleted && originalComment.isDeleted) {
        payload = { action: ContestCommentUpdateAction.UNDELETE };
      }

      if (comment.comment !== originalComment.comment) {
        payload = {
          action: ContestCommentUpdateAction.EDIT,
          comment: comment.comment,
        };
      }

      if (!payload) {
        throw new Error(`Missing payload/action in comment update`);
      }

      return {
        endpoint: `contests/0.1/comments/${originalComment.id}/`,
        method: 'PUT',
        payload,
      };
    },
    remove: (_, commentId, originalDocument) => ({
      endpoint: `/contests/0.1/comments/${commentId}/`,
      method: 'DELETE',
      payload: {},
    }),
  };
}
