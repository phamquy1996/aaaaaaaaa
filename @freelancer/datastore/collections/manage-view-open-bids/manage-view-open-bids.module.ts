import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { manageViewOpenBidsBackend } from './manage-view-open-bids.backend';
import { manageViewOpenBidsReducer } from './manage-view-open-bids.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('manageViewOpenBids', manageViewOpenBidsReducer),
    BackendModule.forFeature('manageViewOpenBids', manageViewOpenBidsBackend),
  ],
})
export class DatastoreManageViewOpenBidsModule {}
