import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { discoverCollectionsBackend } from './discover-collections.backend';
import { discoverCollectionsReducer } from './discover-collections.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('discoverCollections', discoverCollectionsReducer),
    BackendModule.forFeature('discoverCollections', discoverCollectionsBackend),
  ],
})
export class DatastoreDiscoverCollectionsModule {}
