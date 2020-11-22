import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { cartItemsBackend } from './cart-items.backend';
import { cartItemsReducer } from './cart-items.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('cartItems', cartItemsReducer),
    BackendModule.forFeature('cartItems', cartItemsBackend),
  ],
})
export class DatastoreCartItemsModule {}
