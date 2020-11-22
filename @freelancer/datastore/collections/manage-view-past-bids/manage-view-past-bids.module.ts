import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { manageViewPastBidsBackend } from './manage-view-past-bids.backend';
import { manageViewPastBidsReducer } from './manage-view-past-bids.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('manageViewPastBids', manageViewPastBidsReducer),
    BackendModule.forFeature('manageViewPastBids', manageViewPastBidsBackend),
  ],
})
export class DatastoreManageViewPastBidsModule {}
