import { SourceTypeApi } from 'api-typings/messages/messages_types';
import { RichMessage } from './rich-message.model';

export enum MessageSendStatus {
  SENDING,
  SENT,
  FAILED,
}

/**
 * A chat message.
 *
 * Projections: `thread_details`, `user_details`
 */
export interface Message {
  readonly attachments: ReadonlyArray<string>; // filenames
  readonly clientMessageId?: number;
  readonly fromUser: number;
  readonly id: number; // Either client or messageId
  readonly message: string;
  readonly messageId?: number;
  readonly messageSource?: SourceTypeApi;
  readonly parentId?: number;
  readonly removeReason?: string;
  readonly richMessage?: RichMessage;
  readonly threadId: number;
  readonly timeCreated: number;
  readonly sendStatus: MessageSendStatus;
}
