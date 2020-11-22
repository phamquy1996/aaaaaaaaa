import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { freelancerReputationsBackend } from './freelancer-reputations.backend';
import { freelancerReputationsReducer } from './freelancer-reputations.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'freelancerReputations',
      freelancerReputationsReducer,
    ),
    BackendModule.forFeature(
      'freelancerReputations',
      freelancerReputationsBackend,
    ),
  ],
})
export class DatastoreFreelancerReputationsModule {}
