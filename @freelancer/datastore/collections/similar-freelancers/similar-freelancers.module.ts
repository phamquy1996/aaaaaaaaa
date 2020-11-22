import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { similarFreelancersBackend } from './similar-freelancers.backend';
import { similarFreelancersReducer } from './similar-freelancers.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('similarFreelancers', similarFreelancersReducer),
    BackendModule.forFeature('similarFreelancers', similarFreelancersBackend),
  ],
})
export class DatastoreSimilarFreelancersModule {}
