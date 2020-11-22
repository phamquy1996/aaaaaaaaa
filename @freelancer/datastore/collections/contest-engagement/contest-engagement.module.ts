import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestEngagementBackend } from './contest-engagement.backend';
import { contestEngagementReducer } from './contest-engagement.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestEngagement', contestEngagementReducer),
    BackendModule.forFeature('contestEngagement', contestEngagementBackend),
  ],
})
export class DatastoreContestEngagementModule {}
