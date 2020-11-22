import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { membershipSubscriptionBackend } from './membership-subscription.backend';
import { membershipSubscriptionReducer } from './membership-subscription.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'membershipSubscription',
      membershipSubscriptionReducer,
    ),
    BackendModule.forFeature(
      'membershipSubscription',
      membershipSubscriptionBackend,
    ),
  ],
})
export class DatastoreMembershipSubscriptionModule {}
