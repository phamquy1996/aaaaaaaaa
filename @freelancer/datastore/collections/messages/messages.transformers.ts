import { WebsocketNewMessageEvent } from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import {
  MessageApi,
  RichMessageApi,
} from 'api-typings/messages/messages_types';
import { Message, MessageSendStatus } from './messages.model';
import { RichMessage, RichMessageElement } from './rich-message.model';

const transformRichMessage = (
  richMessageApi: RichMessageApi | undefined,
): RichMessage | undefined => {
  if (richMessageApi) {
    // TODO T38296 Remove `any` from reviver in rich message transformation.
    const contentJSON = JSON.parse(richMessageApi.content, function reviver(
      this: RichMessageElement & { [index: string]: any },
      k: string,
      v,
    ) {
      switch (k) {
        case 'content-type':
        case 'display-type': {
          // transform dash-case to camelCase
          const parts = k.split('-');
          const caps = parts
            .slice(1)
            .map((s: string) => `${s[0].toUpperCase()}${s.slice(1)}`)
            .join('');
          this[`${parts[0]}${caps}`] = v;
          break;
        }
        case 'action': {
          return v.toUpperCase();
        }
        case 'from_user': {
          // transform snake_case to camelCase
          const parts = k.split('_');
          const caps = parts
            .slice(1)
            .map((s: string) => `${s[0].toUpperCase()}${s.slice(1)}`)
            .join('');
          this[`${parts[0]}${caps}`] = v;
          break;
        }
        case 'type': {
          return v.toLowerCase();
        }
        default: {
          return v;
        }
      }
    }) as RichMessage;
    const submissionJSON = richMessageApi.latest_submissions
      ? JSON.parse(richMessageApi.latest_submissions)
      : undefined;
    if (
      contentJSON &&
      contentJSON.long &&
      contentJSON.short &&
      contentJSON.email
    ) {
      return {
        category: richMessageApi.category,
        long: contentJSON.long.map(e => (e instanceof Array ? e : [e])),
        short: contentJSON.short.map(e => (e instanceof Array ? e : [e])),
        email: contentJSON.email,
        latestSubmissions: submissionJSON,
        fromUser: contentJSON.fromUser,
        types: contentJSON.types,
      };
    }
  }
  return undefined;
};

export function transformMessage(item: MessageApi): Message {
  const attachments = item.attachments
    ? item.attachments.map(a => a.filename)
    : [];
  return {
    id: item.id,
    attachments,
    clientMessageId: toNumber(item.client_message_id),
    fromUser: item.from_user,
    message: item.message,
    messageId: item.id,
    messageSource: item.message_source,
    richMessage: transformRichMessage(item.rich_message),
    threadId: item.thread_id,
    timeCreated: item.time_created * 1000,
    sendStatus: MessageSendStatus.SENT,
  };
}

export function transformWebsocketMessage(
  payload: WebsocketNewMessageEvent,
): Message {
  const item = payload.data;
  return {
    id: item.id,
    attachments: [],
    clientMessageId: toNumber(item.client_message_id),
    fromUser: item.from_user,
    message: item.message,
    messageId: item.id,
    messageSource: item.message_source,
    parentId: item.parent_id,
    richMessage: transformRichMessage(item.rich_message),
    threadId: item.thread_id,
    timeCreated: item.time_created * 1000,
    sendStatus: MessageSendStatus.SENT,
  };
}
