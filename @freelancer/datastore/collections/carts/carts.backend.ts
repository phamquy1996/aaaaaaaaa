import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { CartStatusApi } from 'api-typings/payments/payments';
import { CartUpdateActionRawPayload } from './carts.backend-model';
import { CartsCollection } from './carts.types';

export function cartsBackend(): Backend<CartsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `payments/0.1/carts/`,
      params: {
        cart_ids: ids,
      },
    }),
    push: (authUid, cart) => ({
      endpoint: `payments/0.1/carts/`,
      payload: {
        return_action: cart.returnAction,
        description: cart.description,
      },
    }),
    set: undefined,
    update: (authUid, cart, originalCart) => {
      const endpoint = `payments/0.1/carts/${originalCart.id}`;
      const method = 'PUT';
      let payload: CartUpdateActionRawPayload | undefined;

      if (cart.status === CartStatusApi.CHARGED) {
        payload = { action: 'process' };
      }

      if (payload) {
        return { payload, endpoint, method };
      }
      throw new Error('Cannot update for carts');
    },
    remove: undefined,
  };
}
