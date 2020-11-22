import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { MessagesCollection } from './messages.types';

export function messagesBackend(): Backend<MessagesCollection> {
  return {
    defaultOrder: {
      field: 'timeCreated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `messages/0.1/messages`,
      params: {
        threads: getQueryParamValue(query, 'threadId'),
        thread_details: 'true',
      },
    }),
    push: (_, message) => ({
      endpoint: `messages/0.1/threads/${message.threadId}/messages/`,
      asFormData: true,
      payload: {
        message: message.message,
        client_message_id: message.clientMessageId
          ? String(message.clientMessageId)
          : String(Date.now()),
        source: message.messageSource,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
