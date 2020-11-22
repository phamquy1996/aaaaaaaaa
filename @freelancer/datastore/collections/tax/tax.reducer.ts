import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTax } from './tax.transformers';
import { TaxCollection } from './tax.types';

export function taxReducer(
  state: CollectionStateSlice<TaxCollection> = {},
  action: CollectionActions<TaxCollection>,
) {
  switch (action.type) {
    // Network request fetched items successfully, merge them into the state
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'tax') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TaxCollection>(
          state,
          transformIntoDocuments([result], transformTax, ref.path.authUid),
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
