import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCart } from './carts.transformers';
import { CartsCollection } from './carts.types';

export function cartsReducer(
  state: CollectionStateSlice<CartsCollection> = {},
  action: CollectionActions<CartsCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'carts') {
        const { result: cart, ref } = action.payload;
        return mergeWebsocketDocuments<CartsCollection>(
          state,
          transformIntoDocuments([cart], transformCart),
          ref,
        );
      }
      return state;
    }
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'carts') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CartsCollection>(
          state,
          transformIntoDocuments(result.carts, transformCart),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'carts') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments<CartsCollection>(
          state,
          transformIntoDocuments([result], transformCart),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
