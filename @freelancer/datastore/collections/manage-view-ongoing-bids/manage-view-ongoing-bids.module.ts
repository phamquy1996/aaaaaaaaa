import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { manageViewOngoingBidsBackend } from './manage-view-ongoing-bids.backend';
import { manageViewOngoingBidsReducer } from './manage-view-ongoing-bids.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'manageViewOngoingBids',
      manageViewOngoingBidsReducer,
    ),
    BackendModule.forFeature(
      'manageViewOngoingBids',
      manageViewOngoingBidsBackend,
    ),
  ],
})
export class DatastoreManageViewOngoingBidsModule {}
