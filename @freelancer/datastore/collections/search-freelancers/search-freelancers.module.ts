import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchFreelancersBackend } from './search-freelancers.backend';
import { searchFreelancersReducer } from './search-freelancers.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchFreelancers', searchFreelancersReducer),
    BackendModule.forFeature('searchFreelancers', searchFreelancersBackend),
  ],
})
export class DatastoreSearchFreelancersModule {}
