import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCartItem } from './cart-items.transformers';
import { CartItemsCollection } from './cart-items.types';

export function cartItemsReducer(
  state: CollectionStateSlice<CartItemsCollection> = {},
  action: CollectionActions<CartItemsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'cartItems') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CartItemsCollection>(
          state,
          transformIntoDocuments(result.cart_items, transformCartItem),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'cartItems') {
        const { result: cartItem, ref } = action.payload;
        return mergeWebsocketDocuments<CartItemsCollection>(
          state,
          transformIntoDocuments([cartItem], transformCartItem),
          ref,
        );
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'cartItems') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<CartItemsCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }

      return state;
    }

    case 'WS_MESSAGE': {
      if (action.payload.parent_type === 'notifications') {
        const ref: Reference<CartItemsCollection> = {
          path: {
            collection: 'cartItems',
            authUid: action.payload.toUserId,
          },
        };
        switch (action.payload.type) {
          case 'cartItemsUpdate':
            return mergeWebsocketDocuments<CartItemsCollection>(
              state,
              transformIntoDocuments(
                action.payload.data.cartItems,
                transformCartItem,
              ),
              ref,
            );
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
