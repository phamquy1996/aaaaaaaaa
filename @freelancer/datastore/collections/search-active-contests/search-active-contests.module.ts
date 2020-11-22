import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchActiveContestsBackend } from './search-active-contests.backend';
import { searchActiveContestsReducer } from './search-active-contests.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchActiveContests', searchActiveContestsReducer),
    BackendModule.forFeature(
      'searchActiveContests',
      searchActiveContestsBackend,
    ),
  ],
})
export class DatastoreSearchActiveContestsModule {}
