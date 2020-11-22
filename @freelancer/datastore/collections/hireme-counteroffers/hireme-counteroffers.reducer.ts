import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { transformHiremeCounteroffer } from './hireme-counteroffers.transformers';
import { HiremeCounteroffersCollection } from './hireme-counteroffers.types';

export function hiremeCounterofferReducer(
  state: CollectionStateSlice<HiremeCounteroffersCollection> = {},
  action: CollectionActions<HiremeCounteroffersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'hiremeCounteroffers') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<HiremeCounteroffersCollection>(
          state,
          transformIntoDocuments(
            // `datastore.document` will not emit if counteroffer is not found.
            // This is consistent with fetching non-existent objects from other
            // collections, e.g. users and projects
            result ? [result] : undefined,
            transformHiremeCounteroffer,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'hiremeCounteroffers') {
        const { delta, ref, originalDocument } = action.payload;

        return updateWebsocketDocuments<HiremeCounteroffersCollection>(
          state,
          [originalDocument.id],
          hiremeCounteroffer => ({ ...hiremeCounteroffer, ...delta }),
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'hiremeCounteroffers') {
        const { result: rawCounteroffer, ref } = action.payload;
        return mergeWebsocketDocuments<HiremeCounteroffersCollection>(
          state,
          transformIntoDocuments(
            [rawCounteroffer],
            transformHiremeCounteroffer,
          ),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
