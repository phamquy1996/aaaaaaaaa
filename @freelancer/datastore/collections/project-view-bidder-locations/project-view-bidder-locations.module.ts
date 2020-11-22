import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectViewBidderLocationsBackend } from './project-view-bidder-locations.backend';
import { projectViewBidderLocationsReducer } from './project-view-bidder-locations.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'projectViewBidderLocations',
      projectViewBidderLocationsReducer,
    ),
    BackendModule.forFeature(
      'projectViewBidderLocations',
      projectViewBidderLocationsBackend,
    ),
  ],
})
export class DatastoreProjectViewBidderLocationsModule {}
