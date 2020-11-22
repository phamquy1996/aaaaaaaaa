import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { milestoneRequestsBackend } from './milestone-requests.backend';
import { milestoneRequestsReducer } from './milestone-requests.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('milestoneRequests', milestoneRequestsReducer),
    BackendModule.forFeature('milestoneRequests', milestoneRequestsBackend),
  ],
})
export class DatastoreMilestoneRequestsModule {}
