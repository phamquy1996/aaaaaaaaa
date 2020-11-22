import { keyBy } from '@freelancer/datastore';
import {
  Message,
  MessageSendStatus,
  SupportStatus,
  Team,
  Thread,
  ThreadContextType,
  User,
} from '@freelancer/datastore/collections';
import { ThreadIdentifier } from '@freelancer/local-storage';
import { isDefined, jsonStableStringify, toNumber } from '@freelancer/utils';
import {
  ContextTypeApi,
  SourceTypeApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import * as Rx from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ChatAttributes } from './chat-box/chat-box.component';

export const threadsEqual = (
  fake?: ThreadIdentifier,
  other?: ThreadIdentifier,
): boolean => {
  if (fake === undefined || other === undefined) {
    return false;
  }

  if (fake.id === other.id) {
    return true;
  }

  // context equality compares context and thread type
  const contextsEqual =
    // compare IDs if type is not NONE
    (fake.context.type !== ContextTypeApi.NONE &&
      other.context.type !== ContextTypeApi.NONE &&
      fake.context.type === other.context.type &&
      fake.context.id === other.context.id) ||
    (fake.context.type === ContextTypeApi.NONE &&
      other.context.type === ContextTypeApi.NONE);

  const typesEqual = fake.threadType === other.threadType;

  const threadMemberSet = new Set(other.members);

  const membersEqual =
    fake.members.every(m => threadMemberSet.has(m)) &&
    fake.members.length === other.members.length;

  return contextsEqual && typesEqual && membersEqual;
};

export function isMessageEqual(message?: Message, other?: Message): boolean {
  if (message === undefined || other === undefined) {
    return false;
  }
  return (
    message.message === other.message &&
    message.messageId === other.messageId &&
    message.threadId === other.threadId &&
    message.timeCreated === other.timeCreated
  );
}

export function createThreadBody(
  thread: Thread,
  messageString: string = '',
  authUid: number,
): Thread {
  const clientMessageId = Date.now();
  const message: Message = {
    attachments: [],
    clientMessageId,
    fromUser: authUid,
    id: clientMessageId,
    message: messageString,
    messageSource: SourceTypeApi.CHAT_BOX,
    threadId: thread.id,
    timeCreated: Date.now(),
    sendStatus: MessageSendStatus.SENDING,
  };

  return {
    ...thread,
    message,
    isFake: false,
  };
}

export type SupportUser = User & { supportStatus: SupportStatus };

export function isSupportUser(user?: User): user is SupportUser {
  return !!(user && user.supportStatus && user.supportStatus.type);
}

export function threadToContextIds(
  threads: ReadonlyArray<Thread>,
  contextType: ThreadContextType,
): ReadonlyArray<string> {
  const contextIds = threads.reduce(
    (acc, thread) =>
      thread.context.type === contextType && thread.context.id
        ? [...acc, thread.context.id.toString()]
        : acc,
    [] as string[],
  );
  return Array.from(new Set(contextIds));
}

export function buildThreadIdentifier(thread: Thread): ThreadIdentifier {
  return {
    id: thread.id,
    threadType: thread.threadType,
    context: thread.context,
    members: thread.members,
    isFake: thread.isFake,
  };
}

export function getThreadIdentifierKey(
  threadIdentifier: ThreadIdentifier,
): string {
  const threadIdentifierString = jsonStableStringify(threadIdentifier) || '';
  return threadIdentifierString; // `${chatDraftStorageKey}_${threadIdentifierString}`
}

export function getTeamFromChat(
  teams$: Rx.Observable<{ [key: number]: Team }>,
  chat: ChatAttributes,
): Rx.Observable<Team> {
  return teams$.pipe(
    map(teams => {
      const { context, threadType } = chat.threadIdentifier;
      if (
        context.type === ContextTypeApi.TEAM &&
        context.id &&
        teams[context.id]
      ) {
        return teams[context.id];
      }
      if (
        context.type === ContextTypeApi.PROJECT &&
        threadType === ThreadTypeApi.TEAM
      ) {
        const teamOwnerToTeamMap = keyBy(
          Object.values(teams),
          team => team.ownerUserId,
        );
        const teamOwner = Object.keys(teamOwnerToTeamMap).find(teamOwnerId =>
          chat.threadIdentifier.members.includes(toNumber(teamOwnerId)),
        );
        if (teamOwner) {
          return teamOwnerToTeamMap[toNumber(teamOwner)];
        }
      }
    }),
    filter(isDefined),
  );
}
