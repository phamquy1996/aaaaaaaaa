import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectViewBidsBackend } from './project-view-bids.backend';
import { projectViewBidsReducer } from './project-view-bids.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectViewBids', projectViewBidsReducer),
    BackendModule.forFeature('projectViewBids', projectViewBidsBackend),
  ],
})
export class DatastoreProjectViewBidsModule {}
