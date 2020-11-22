import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { MessageAttachmentsCollection } from './message-attachments.types';

export function messageAttachmentsBackend(): Backend<
  MessageAttachmentsCollection
> {
  return {
    defaultOrder: {
      field: 'timeCreated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `messages/0.1/threads/${getQueryParamValue(
        query,
        'threadId',
      )}/attachments/`,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
