import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { superuserBidsBackend } from './superuser-bids.backend';
import { superuserBidsReducer } from './superuser-bids.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('superuserBids', superuserBidsReducer),
    BackendModule.forFeature('superuserBids', superuserBidsBackend),
  ],
})
export class DatastoreSuperuserBidsModule {}
