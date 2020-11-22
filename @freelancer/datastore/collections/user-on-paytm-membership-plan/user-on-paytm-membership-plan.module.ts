import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userOnPaytmMembershipPlanBackend } from './user-on-paytm-membership-plan.backend';
import { userOnPaytmMembershipPlanReducer } from './user-on-paytm-membership-plan.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'userOnPaytmMembershipPlan',
      userOnPaytmMembershipPlanReducer,
    ),
    BackendModule.forFeature(
      'userOnPaytmMembershipPlan',
      userOnPaytmMembershipPlanBackend,
    ),
  ],
})
export class DatastoreUserOnPaytmMembershipPlanModule {}
