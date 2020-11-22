import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { DeloitteSubscriberEmailsCollection } from './deloitte-subscriber-emails.types';

export function deloitteSubscriberEmailsBackend(): Backend<
  DeloitteSubscriberEmailsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'enterprise/deloitte_subscriber_emails.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
