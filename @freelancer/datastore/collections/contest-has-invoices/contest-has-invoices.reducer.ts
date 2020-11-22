import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestHasInvoice } from './contest-has-invoices.transformers';
import { ContestHasInvoicesCollection } from './contest-has-invoices.types';

export function contestHasInvoiceReducer(
  state: CollectionStateSlice<ContestHasInvoicesCollection> = {},
  action: CollectionActions<ContestHasInvoicesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestHasInvoices') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestHasInvoicesCollection>(
          state,
          transformIntoDocuments(result, transformContestHasInvoice),
          order,
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
