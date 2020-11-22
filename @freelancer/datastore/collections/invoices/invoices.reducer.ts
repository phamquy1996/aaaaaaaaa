import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import {
  transformInvoice,
  transformWebSocketUpdatedInvoiceEvent,
} from './invoices.transformers';
import { InvoicesCollection } from './invoices.types';

export function invoicesReducer(
  state: CollectionStateSlice<InvoicesCollection> = {},
  action: CollectionActions<InvoicesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'invoices') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<InvoicesCollection>(
          state,
          transformIntoDocuments(result.invoices, transformInvoice),
          order,
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      if (action.payload.parent_type === 'notifications') {
        const ref: Reference<InvoicesCollection> = {
          path: {
            collection: 'invoices',
            authUid: action.payload.toUserId,
          },
        };

        switch (action.payload.type) {
          case 'invoiceUpdated': {
            return mergeWebsocketDocuments(
              state,
              [transformWebSocketUpdatedInvoiceEvent(action.payload)],
              ref,
            );
          }

          default:
            return state;
        }
      }

      return state;
    }

    default:
      return state;
  }
}
