import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchHistoryBackend } from './search-history.backend';
import { searchHistoryReducer } from './search-history.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchHistory', searchHistoryReducer),
    BackendModule.forFeature('searchHistory', searchHistoryBackend),
  ],
})
export class DatastoreSearchHistoryModule {}
