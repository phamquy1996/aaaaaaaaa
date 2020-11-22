import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestInterestedFreelancersBackend } from './contest-interested-freelancers.backend';
import { contestInterestedFreelancersReducer } from './contest-interested-freelancers.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'contestInterestedFreelancers',
      contestInterestedFreelancersReducer,
    ),
    BackendModule.forFeature(
      'contestInterestedFreelancers',
      contestInterestedFreelancersBackend,
    ),
  ],
})
export class DatastoreContestInterestedFreelancersModule {}
