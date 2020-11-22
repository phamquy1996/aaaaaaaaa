import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { discoverCollectionItemsBackend } from './discover-collection-items.backend';
import { discoverCollectionItemsReducer } from './discover-collection-items.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'discoverCollectionItems',
      discoverCollectionItemsReducer,
    ),
    BackendModule.forFeature(
      'discoverCollectionItems',
      discoverCollectionItemsBackend,
    ),
  ],
})
export class DatastoreDiscoverCollectionItemsModule {}
