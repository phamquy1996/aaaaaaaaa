import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { paymentShareMembersBackend } from './payment-share-members.backend';
import { paymentShareMembersReducer } from './payment-share-members.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('paymentShareMembers', paymentShareMembersReducer),
    BackendModule.forFeature('paymentShareMembers', paymentShareMembersBackend),
  ],
})
export class DatastorePaymentShareMembersModule {}
