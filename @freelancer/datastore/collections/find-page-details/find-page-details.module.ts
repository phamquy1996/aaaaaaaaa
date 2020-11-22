import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { findPageDetailsBackend } from './find-page-details.backend';
import { findPageDetailsReducer } from './find-page-details.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('findPageDetails', findPageDetailsReducer),
    BackendModule.forFeature('findPageDetails', findPageDetailsBackend),
  ],
})
export class DatastoreFindPageDetailsModule {}
