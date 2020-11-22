import { generateId } from '@freelancer/datastore/testing';
import {
  FolderApi,
  PrivacyLevelApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import { Thread, ThreadContext } from './threads.model';

export interface GenerateThreadsOptions {
  readonly id?: number;
  readonly userId: number;
  readonly otherMembers: ReadonlyArray<number>;
  readonly context: ThreadContext;
  readonly unreadMessageCount?: number;
}

export function generateThread(options: GenerateThreadsOptions): Thread {
  return {
    context: options.context,
    contextType: options.context.type,
    folder: FolderApi.INBOX,
    id: options.id ?? generateId(),
    isBlocked: false,
    isFake: false,
    isMuted: false,
    isRead: !!options.unreadMessageCount,
    members: [options.otherMembers[0], options.userId],
    inactiveMembers: [],
    messageUnreadCount: options.unreadMessageCount ?? 0,
    otherMembers: [options.otherMembers[0]],
    owner: options.userId,
    threadType: ThreadTypeApi.PRIVATE_CHAT,
    timeCreated: Date.now(),
    timeRead: Date.now(),
    timeUpdated: Date.now(),
    userReadTimes: {
      [options.userId]: Date.now(),
      [options.otherMembers[0]]: Date.now(),
    },
    writePrivacy: PrivacyLevelApi.MEMBERS,
  };
}
