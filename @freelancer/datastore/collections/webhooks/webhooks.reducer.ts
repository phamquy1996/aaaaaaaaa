import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformWebhooks } from './webhooks.transformers';
import { WebhooksCollection } from './webhooks.types';

export function webhooksReducer(
  state: CollectionStateSlice<WebhooksCollection> = {},
  action: CollectionActions<WebhooksCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'webhooks') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<WebhooksCollection>(
          state,
          transformIntoDocuments(result.webhooks, transformWebhooks),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH': {
      // we don't want to update the collection prior to the action
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      // only on success
      if (action.payload.type === 'webhooks') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<WebhooksCollection>(
          state,
          transformIntoDocuments([result], transformWebhooks),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'webhooks') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<WebhooksCollection>(
          state,
          transformIntoDocuments([result], transformWebhooks),
          ref,
        );
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'webhooks') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<WebhooksCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
