import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchContestEntriesBackend } from './search-contest-entries.backend';
import { searchContestEntriesReducer } from './search-contest-entries.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchContestEntries', searchContestEntriesReducer),
    BackendModule.forFeature(
      'searchContestEntries',
      searchContestEntriesBackend,
    ),
  ],
})
export class DatastoreSearchContestEntriesModule {}
