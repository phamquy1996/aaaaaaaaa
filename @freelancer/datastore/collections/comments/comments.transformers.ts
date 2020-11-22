import { MessageApi } from 'api-typings/messages/messages_types';
import { Comment } from './comments.model';

export function transformComment(comment: MessageApi): Comment {
  return {
    id: comment.id,
    fromUser: comment.from_user,
    comment: comment.message,
    parentId: comment.parent_id ? comment.parent_id : undefined,
    threadId: comment.thread_id,
    timeCreated: comment.time_created * 1000,
  };
}
