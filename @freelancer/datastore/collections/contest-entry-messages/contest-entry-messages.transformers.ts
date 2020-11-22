import { MessagesGetResultApi, ThreadApi } from 'api-typings/contests/contests';
import { transformMessageApiToContestMessage } from '../contest-messages/contest-messages.transformers';
import { ContestEntryMessage } from './contest-entry-messages.model';

export function transformEntryMessageThread(
  entry: ThreadApi,
  usersList?: MessagesGetResultApi['users'],
): ContestEntryMessage {
  return {
    id: entry.message.id || 0,
    contestId: entry.message.contest_id,
    entryId: entry.message.entry_id ? entry.message.entry_id : 0,
    message: transformMessageApiToContestMessage(entry.message, usersList),
    replies: entry.replies
      ? entry.replies.map(reply =>
          transformMessageApiToContestMessage(reply, usersList),
        )
      : undefined,
  };
}
