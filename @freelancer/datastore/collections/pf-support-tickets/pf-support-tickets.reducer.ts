import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformPFSupportTicket } from './pf-support-tickets.transformers';
import { PfSupportTicketsCollection } from './pf-support-tickets.types';

export function pfSupportTicketsReducer(
  state: CollectionStateSlice<PfSupportTicketsCollection> = {},
  action: CollectionActions<PfSupportTicketsCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'pfSupportTickets') {
        const { document: ticket, ref } = action.payload;
        return mergeWebsocketDocuments<PfSupportTicketsCollection>(
          state,
          transformIntoDocuments([ticket], transformPFSupportTicket),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
