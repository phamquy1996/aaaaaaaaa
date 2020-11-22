import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectBidInfoBackend } from './project-bid-info.backend';
import { projectBidInfoReducer } from './project-bid-info.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectBidInfo', projectBidInfoReducer),
    BackendModule.forFeature('projectBidInfo', projectBidInfoBackend),
  ],
})
export class DatastoreProjectBidInfoModule {}
