import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchMyProjectsBuyerBackend } from './search-my-projects-buyer.backend';
import { searchMyProjectsBuyerReducer } from './search-my-projects-buyer.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'searchMyProjectsBuyer',
      searchMyProjectsBuyerReducer,
    ),
    BackendModule.forFeature(
      'searchMyProjectsBuyer',
      searchMyProjectsBuyerBackend,
    ),
  ],
})
export class DatastoreSearchMyProjectsBuyerModule {}
