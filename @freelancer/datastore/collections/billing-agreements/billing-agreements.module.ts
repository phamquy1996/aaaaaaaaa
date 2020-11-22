import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { billingAgreementsBackend } from './billing-agreements.backend';
import { billingAgreementsReducer } from './billing-agreements.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('billingAgreements', billingAgreementsReducer),
    BackendModule.forFeature('billingAgreements', billingAgreementsBackend),
  ],
})
export class DatastoreBillingAgreementsModule {}
