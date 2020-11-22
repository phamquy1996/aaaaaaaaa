import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchContestEntrantsBackend } from './search-contest-entrants.backend';
import { searchContestEntrantsReducer } from './search-contest-entrants.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'searchContestEntrants',
      searchContestEntrantsReducer,
    ),
    BackendModule.forFeature(
      'searchContestEntrants',
      searchContestEntrantsBackend,
    ),
  ],
})
export class DatastoreSearchContestEntrantsModule {}
