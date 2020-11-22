import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchContestsBackend } from './search-contests.backend';
import { searchContestsReducer } from './search-contests.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchContests', searchContestsReducer),
    BackendModule.forFeature('searchContests', searchContestsBackend),
  ],
})
export class DatastoreSearchContestsModule {}
