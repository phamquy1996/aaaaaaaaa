import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { bidEditRequestsBackend } from './bid-edit-requests.backend';
import { bidEditRequestsReducer } from './bid-edit-requests.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('bidEditRequests', bidEditRequestsReducer),
    BackendModule.forFeature('bidEditRequests', bidEditRequestsBackend),
  ],
})
export class DatastoreBidEditRequestsModule {}
