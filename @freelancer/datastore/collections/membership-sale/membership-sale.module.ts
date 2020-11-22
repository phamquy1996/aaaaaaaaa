import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { membershipSaleBackend } from './membership-sale.backend';
import { membershipSaleReducer } from './membership-sale.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('membershipSale', membershipSaleReducer),
    BackendModule.forFeature('membershipSale', membershipSaleBackend),
  ],
})
export class DatastoreMembershipSaleModule {}
