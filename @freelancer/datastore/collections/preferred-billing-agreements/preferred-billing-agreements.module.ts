import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { preferredBillingAgreementsBackend } from './preferred-billing-agreements.backend';
import { preferredBillingAgreementsReducer } from './preferred-billing-agreements.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'preferredBillingAgreements',
      preferredBillingAgreementsReducer,
    ),
    BackendModule.forFeature(
      'preferredBillingAgreements',
      preferredBillingAgreementsBackend,
    ),
  ],
})
export class DatastorePreferredBillingAgreementsModule {}
