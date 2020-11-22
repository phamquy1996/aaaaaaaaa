import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { bidsBackend } from './bids.backend';
import { bidsReducer } from './bids.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('bids', bidsReducer),
    BackendModule.forFeature('bids', bidsBackend),
  ],
})
export class DatastoreBidsModule {}
