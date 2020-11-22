import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { membershipSubscriptionHistoryBackend } from './membership-subscription-history.backend';
import { membershipSubscriptionHistoryReducer } from './membership-subscription-history.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'membershipSubscriptionHistory',
      membershipSubscriptionHistoryReducer,
    ),
    BackendModule.forFeature(
      'membershipSubscriptionHistory',
      membershipSubscriptionHistoryBackend,
    ),
  ],
})
export class DatastoreMembershipSubscriptionHistoryModule {}
