import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { membershipTrialsBackend } from './membership-trials.backend';
import { membershipTrialsReducer } from './membership-trials.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('membershipTrials', membershipTrialsReducer),
    BackendModule.forFeature('membershipTrials', membershipTrialsBackend),
  ],
})
export class DatastoreMembershipTrialsModule {}
