import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { paymentShareTeamsBackend } from './payment-share-teams.backend';
import { paymentShareTeamsReducer } from './payment-share-teams.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('paymentShareTeams', paymentShareTeamsReducer),
    BackendModule.forFeature('paymentShareTeams', paymentShareTeamsBackend),
  ],
})
export class DatastorePaymentShareTeamsModule {}
