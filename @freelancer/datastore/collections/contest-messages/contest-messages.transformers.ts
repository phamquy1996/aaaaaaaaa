import {
  MessageApi,
  MessagesGetResultApi,
  ThreadApi,
} from 'api-typings/contests/contests';
import { transformBaseUser } from '../users/users.transformers';
import { ContestMessage, ContestMessageItem } from './contest-messages.model';

export function transformContestMessageThread(
  entry: ThreadApi,
  usersList?: MessagesGetResultApi['users'],
): ContestMessage {
  return {
    id: entry.message.id || 0,
    contestId: entry.message.contest_id,
    message: transformMessageApiToContestMessage(entry.message, usersList),
    replies: entry.replies
      ? entry.replies.map(reply =>
          transformMessageApiToContestMessage(reply, usersList),
        )
      : undefined,
  };
}

export function transformMessageApiToContestMessage(
  message: MessageApi,
  usersList: MessagesGetResultApi['users'] | undefined,
): ContestMessageItem {
  const messageAuthor =
    usersList && message.from_user_id
      ? usersList[message.from_user_id]
      : undefined;
  return {
    id: message.id || 0,
    contestId: message.contest_id,
    comment: message.comment,
    entryId: message.entry_id,
    parentId: message.parent_id,
    fromUserId: message.from_user_id,
    toUserId: message.to_user_id,
    isPrivate: message.is_private,
    timestamp: message.timestamp ? message.timestamp * 1000 : undefined,
    user: messageAuthor ? transformBaseUser(messageAuthor) : undefined,
  };
}
