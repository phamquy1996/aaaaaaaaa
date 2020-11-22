import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  DatastoreCartItemsModule,
  DatastoreCartsModule,
} from '@freelancer/datastore/collections';
import { PaymentsCart } from './payments-cart.service';

@NgModule({
  imports: [DatastoreCartsModule, DatastoreCartItemsModule, RouterModule],
  providers: [PaymentsCart],
})
export class PaymentsCartModule {}
