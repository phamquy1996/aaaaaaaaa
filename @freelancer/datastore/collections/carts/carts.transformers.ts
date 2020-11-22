import { CartApi, ReturnActionApi } from 'api-typings/payments/payments';
import { Cart, CartReturnAction } from './carts.model';

export function transformCart(cart: CartApi): Cart {
  return {
    id: cart.id,
    description: cart.description || undefined,
    status: cart.status,
    time_created: cart.time_created * 1000,
    returnAction: transformReturnAction(cart.return_action),
    userId: cart.user_id,
  };
}

export function transformReturnAction(
  returnAction: ReturnActionApi,
): CartReturnAction {
  return {
    destination: returnAction.destination,
    // Since we don't have a specific type for payload for now, and we are not using it at the moment,
    // we will make it an empty string, as it is used in a url and should not be `undefined`
    payload: returnAction.payload ? returnAction.payload : '',
  };
}
