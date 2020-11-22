import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { cartsBackend } from './carts.backend';
import { cartsReducer } from './carts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('carts', cartsReducer),
    BackendModule.forFeature('carts', cartsBackend),
  ],
})
export class DatastoreCartsModule {}
