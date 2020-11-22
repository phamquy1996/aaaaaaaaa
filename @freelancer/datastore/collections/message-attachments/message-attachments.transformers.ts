import { AttachmentApi } from 'api-typings/messages/messages_types';
import { MessageAttachment } from './message-attachments.model';

export function transformMessageAttachment(
  attachment: AttachmentApi,
  threadId: number,
): MessageAttachment {
  if (!attachment.id || !attachment.message_id || !attachment.time_created) {
    throw new ReferenceError(`Missing a required attachment field.`);
  }

  return {
    id: attachment.id,
    threadId,
    messageId: attachment.message_id,
    filename: attachment.filename,
    timeCreated: attachment.time_created * 1000,
  };
}
