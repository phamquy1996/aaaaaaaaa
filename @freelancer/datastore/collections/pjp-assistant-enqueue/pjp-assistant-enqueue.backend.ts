import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { PjpAssistantEnqueueCollection } from './pjp-assistant-enqueue.types';

export function pjpAssistantEnqueueBackend(): Backend<
  PjpAssistantEnqueueCollection
> {
  return {
    // Ordering of items within the collection.
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: undefined,
    push: (authUid, document, extra) => ({
      endpoint: 'pjp-assistant/enqueueUserToPjpAssistantQueue.php',
      // This is an AJAX-API.
      isGaf: true,
      payload: {},
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
