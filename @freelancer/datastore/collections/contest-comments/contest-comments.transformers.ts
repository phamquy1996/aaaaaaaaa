import {
  ContestCommentApi,
  ContestCommentContextTypeApi,
  MessageApi,
} from 'api-typings/contests/contests';
import {
  ContestComment,
  ContestCommentType,
  ParentContestComment,
  ReplyContestComment,
} from './contest-comments.model';

export function transformContestComment(
  comment: ContestCommentApi,
): ContestComment {
  if (!comment.timestamp) {
    throw new Error(
      'Missing timestamp when trying to transform to ContestComment object',
    );
  }

  const baseComment = {
    id: comment.id,
    contextType: comment.context_type,
    contextId: comment.context_id,
    comment: comment.comment,
    isPrivate: comment.is_private,
    fromUserId: comment.from_user_id,
    timestamp: comment.timestamp * 1000,
    dateLastComment: comment.date_last_comment
      ? comment.date_last_comment * 1000
      : 0,
    isDeleted: false,
  };

  if (comment.parent_id) {
    // API possibly returns 0 for to_user_id so we specifically check for null here
    if (comment.to_user_id === null) {
      throw new Error(
        'Missing to_user_id when trying to transform to ContestComment object',
      );
    }
    return {
      ...baseComment,
      type: ContestCommentType.REPLY,
      parentId: comment.parent_id,
      toUserId: comment.to_user_id,
    } as ReplyContestComment;
  }

  if (
    comment.context_type === ContestCommentContextTypeApi.ANNOTATION &&
    (!comment.annotation_id ||
    comment.x_coordinate === null || // 0 is a valid value for coordinates so we specifically check for null here
    comment.y_coordinate === null || // 0 is a valid value for coordinates so we specifically check for null here
      !comment.file_id)
  ) {
    throw new Error(
      'Missing at least one of the required properties for transforming to annotation ContestComment object: annotation_id, x_coordinate, y_coordinate, file_id',
    );
  }

  return {
    ...baseComment,
    type: ContestCommentType.PARENT,
    parentId: undefined,
    repliesCount: comment.replies_count || 0,
    annotationDetails:
      comment.context_type === ContestCommentContextTypeApi.ANNOTATION
        ? {
            annotationId: comment.annotation_id,
            coordinates: {
              x: comment.x_coordinate,
              y: comment.y_coordinate,
            },
            fileId: comment.file_id,
          }
        : undefined,
  } as ParentContestComment;
}

export function transformMessageApiToContestComment(
  comment: MessageApi,
  senderId: number,
): ContestComment {
  // In MessageApi, `id` is an optional field
  const commentId = comment.id ? comment.id : 0;

  // We set the contextType and contextId by checking
  // values that exist in the result
  let contextType: ContestCommentContextTypeApi;
  let contextId: number;

  if (comment.annotation_id && comment.file_id) {
    contextType = ContestCommentContextTypeApi.ANNOTATION;
    contextId = comment.file_id;
  } else if (comment.entry_id) {
    contextType = ContestCommentContextTypeApi.ENTRY;
    contextId = comment.entry_id;
  } else {
    contextType = ContestCommentContextTypeApi.CONTEST;
    contextId = comment.contest_id;
  }

  const parentId = comment.parent_id ? comment.parent_id : undefined;

  return transformContestComment({
    id: commentId,
    context_type: contextType,
    context_id: contextId,
    comment: comment.comment,
    parent_id: parentId,
    is_private: comment.is_private,
    from_user_id: senderId,
    to_user_id: comment.to_user_id,
    annotation_id: comment.annotation_id,
    x_coordinate: comment.x_coordinate,
    y_coordinate: comment.y_coordinate,
    file_id: comment.file_id,
    timestamp: comment.timestamp,
    date_last_comment: comment.timestamp,
  });
}
