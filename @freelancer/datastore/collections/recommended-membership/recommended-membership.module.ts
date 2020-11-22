import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { recommendedMembershipBackend } from './recommended-membership.backend';
import { recommendedMembershipReducer } from './recommended-membership.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'recommendedMembership',
      recommendedMembershipReducer,
    ),
    BackendModule.forFeature(
      'recommendedMembership',
      recommendedMembershipBackend,
    ),
  ],
})
export class DatastoreRecommendedMembershipModule {}
