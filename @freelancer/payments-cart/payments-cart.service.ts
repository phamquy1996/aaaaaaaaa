import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import {
  BackendPushResponse,
  BackendSuccessResponse,
  Datastore,
} from '@freelancer/datastore';
import {
  CartItem,
  CartItemsCollection,
  CartReturnAction,
  CartsCollection,
} from '@freelancer/datastore/collections';
import { toNumber } from '@freelancer/utils';
import { CartStatusApi, ItemStatusApi } from 'api-typings/payments/payments';
import { take } from 'rxjs/operators';

export interface PartialPaymentsCartItem {
  description: CartItem['description'];
  amount: CartItem['amount'];
  currencyId: CartItem['currencyId'];
  contextId: CartItem['contextId'];
  contextType: CartItem['contextType'];
  contextSubType?: CartItem['contextSubType'];
  useBonus?: CartItem['useBonus'];
}

/**
 * The advised usage of this service is the following
 *
 * ```lang=ts
 * const myItems: ReadonlyArray<PartialCartItem> = [...];
 *
 * this.cart.handle(
 *   description,
 *   someAction,
 *   myItems,
 *   myCallback,
 * );
 *
 * ```
 *
 * `items` should be validated and saved as dra\ts, which probably means another
 * level of chaining requests like so:
 *
 * ```lang=ts
 * const myItems = validateAndSaveMyItems().then(
 *   items => {
 *     // additional processing on items for type's sake
 *     this.cart.handle(
 *       description,
 *       someAction,
 *       items,
 *       myCallback,
 *     );
 *   }
 * );
 *
 * Error handling:
 * Errors are returned from the cart as a promise, so you can handle them like
 * ```lang=ts
 * this.cart.handle(...).then(error => ...);
 * ```
 * ```
 */
@Injectable()
export class PaymentsCart {
  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private router: Router,
  ) {}

  handle(
    description: string,
    returnAction: CartReturnAction,
    items: ReadonlyArray<PartialPaymentsCartItem>,
    onRedirectCallback?: Function,
  ): Promise<BackendSuccessResponse | BackendPushResponse<CartsCollection>> {
    return (
      this.auth
        .getUserId()
        .pipe(take(1))
        .toPromise()
        .then(userId =>
          this.createCart(toNumber(userId), description, returnAction).then(
            cartResponse => {
              if (cartResponse.status !== 'success') {
                throw cartResponse;
              }
              return cartResponse;
            },
          ),
        )
        .then(cartResponse => {
          const preparedItems = items.map(i => this.prepareItem(i));
          return this.addItems(cartResponse.id, preparedItems).then(
            () => cartResponse,
          );
        })
        .then(cartResponse => {
          if (onRedirectCallback) {
            onRedirectCallback(); // TODO: check if useful
          }
          this.router.navigate(['/deposit'], {
            queryParams: { cartId: cartResponse.id },
          });
          return {
            status: cartResponse.status,
          };
        })
        // TODO: T87183 handle frontend errors and don't just assume everything is backend.
        .catch(e => ({
          status: e.status,
          errorCode: e.errorCode,
          requestId: e.requestId,
        }))
    );
  }

  private createCart(
    userId: number,
    description: string,
    returnAction: CartReturnAction,
  ): Promise<BackendPushResponse<CartsCollection>> {
    return this.datastore.createDocument<CartsCollection>('carts', {
      time_created: Date.now(),
      status: CartStatusApi.UNPAID,
      description,
      returnAction,
      userId,
    });
  }

  private prepareItem(
    item: PartialPaymentsCartItem,
  ): Omit<CartItem, 'id' | 'cartId'> {
    return {
      ...item,
      status: ItemStatusApi.NOT_DONE,
      useBonus: item.useBonus || false,
    };
  }

  private addItems(
    cartId: number,
    items: ReadonlyArray<Omit<CartItem, 'id' | 'cartId'>>,
  ) {
    // NOTE: overwriting of `cartId`
    return Promise.all(items.map(i => this.addItem({ ...i, cartId })));
  }

  private addItem(
    item: Omit<CartItem, 'id'>,
  ): Promise<BackendPushResponse<CartItemsCollection>> {
    return this.datastore
      .createDocument<CartItemsCollection>('cartItems', item)
      .then(itemResponse => {
        if (itemResponse.status !== 'success') {
          throw itemResponse;
        }
        return itemResponse;
      });
  }
}
