import { CartItemApi } from 'api-typings/payments/payments';
import { CartItem } from './cart-items.model';

export function transformCartItem(cartItem: CartItemApi): CartItem {
  return {
    id: cartItem.id,
    contextId: cartItem.context_id,
    contextType: cartItem.context_type,
    description: cartItem.description || undefined,
    currencyId: cartItem.currency_id,
    amount: cartItem.amount,
    status: cartItem.status,
    cartId: cartItem.cart_id,
    useBonus: cartItem.use_bonus,
    isEscrowRequired: cartItem.is_escrow_required,
    contextSubType:
      cartItem.context_sub_type === -1 ? undefined : cartItem.context_sub_type, // a value of -1 implies the context subtype doesn't exist: D117734#2640192
  };
}
