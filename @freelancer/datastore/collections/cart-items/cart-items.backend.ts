import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { CartItemsCollection } from './cart-items.types';

export function cartItemsBackend(): Backend<CartItemsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `payments/0.1/carts/${
        getQueryParamValue(query, 'cartId')[0]
      }/cart_items/`,
      params: {},
    }),
    push: (_, cartItems) => ({
      endpoint: `payments/0.1/carts/${cartItems.cartId}/cart_items/`,
      payload: {
        context_type: cartItems.contextType,
        context_id: cartItems.contextId,
        description: cartItems.description,
        currency: cartItems.currencyId,
        amount: cartItems.amount,
        cart_id: cartItems.cartId,
        context_sub_type: cartItems.contextSubType
          ? cartItems.contextSubType
          : -1, // API expects value of -1 if context subtype is unused
      },
    }),
    set: undefined,
    update: undefined,
    remove: (_, cartItemId, cartItem) => ({
      payload: {},
      endpoint: `payments/0.1/carts/${cartItem.cartId}/cart_items/${cartItemId}`,
      method: 'DELETE',
    }),
  };
}
