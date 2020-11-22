import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { recruiterOptOutBackend } from './recruiter-opt-out.backend';
import { recruiterOptOutReducer } from './recruiter-opt-out.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('recruiterOptOut', recruiterOptOutReducer),
    BackendModule.forFeature('recruiterOptOut', recruiterOptOutBackend),
  ],
})
export class DatastoreRecruiterOptOutModule {}
