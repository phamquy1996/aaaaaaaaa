import { toNumber } from '@freelancer/utils';
import {
  ContextApi,
  ContextTypeApi,
  FolderApi,
  HighlightApi,
  PrivacyLevelApi,
  ThreadApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import { transformMessage } from '../messages/messages.transformers';
import { Thread, ThreadContext, ThreadHighlight } from './threads.model';

// TODO: thread: any inference needs to go. ContextApi is incorrect.
export function transformThread(thread: ThreadApi, userId: string): Thread {
  const baseThread = thread.thread;

  if (!baseThread.id) {
    throw new Error('Threads should have an id');
  }
  if (!baseThread.owner) {
    throw new Error('Threads should have an owner');
  }

  if (baseThread.thread_type === ThreadTypeApi.COMMENT_FEED) {
    throw new Error('Threads should not have thread type comment feed');
  }

  const userReadTimes = Object.entries(baseThread.user_read_times || {}).reduce(
    (acc, [memberId, readTime]) => ({
      ...acc,
      ...(readTime ? { [memberId]: readTime * 1000 } : {}),
    }),
    {} as Thread['userReadTimes'],
  );

  const threadHighlights =
    !thread.highlights || thread.highlights.length === 0
      ? undefined
      : thread.highlights.map(buildThreadHighlights);

  return {
    context: transformContext(baseThread.context),
    contextType: baseThread.context?.type || ContextTypeApi.NONE,
    folder: thread.folder || FolderApi.INBOX,
    highlights: threadHighlights,
    id: thread.id,
    isBlocked: thread.is_blocked || false,
    isFake: false,
    isMuted: thread.is_muted || false,
    isRead: thread.is_read || false,
    members: baseThread.members || [],
    inactiveMembers: baseThread.inactive_members || [],
    message: baseThread.message
      ? transformMessage(baseThread.message)
      : undefined,
    messageCount: thread.message_count,
    messageUnreadCount: thread.message_unread_count || 0,
    otherMembers: baseThread.members.filter(m => m !== toNumber(userId)),
    owner: baseThread.owner,
    threadType: baseThread.thread_type,
    timeCreated: (baseThread.time_created || 0) * 1000,
    timeRead: (thread.time_read || 0) * 1000,
    timeUpdated: (thread.time_updated || 0) * 1000,
    userReadTimes,
    writePrivacy: baseThread.write_privacy || PrivacyLevelApi.MEMBERS,
  };
}

// Turn { type = 'none', id = undefined } => undefined
// Check context is not of type post, only valid for comment feeds
export function transformContext(context?: ContextApi): ThreadContext {
  if (!context || (context && context.type === ContextTypeApi.NONE)) {
    return { type: ContextTypeApi.NONE };
  }

  if (context.type === ContextTypeApi.POST) {
    throw new Error("Thread should not have context type 'post'");
  }

  // Some context ids might be 0 and they must be excluded from this condition.
  if (context.id === undefined || context.id === null) {
    throw new Error('Threads should have a context id if context is not none');
  }

  return {
    type: context.type,
    id: context.id,
  };
}

function buildThreadHighlights(highlight: HighlightApi): ThreadHighlight {
  return {
    field: highlight.field,
    highlightedText: {
      preceding: highlight.highlighted_text[0] || '',
      highlighted: highlight.highlighted_text[1] || '',
      succeeding: highlight.highlighted_text[2] || '',
    },
  };
}
