import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestViewContestsBackend } from './contest-view-contests.backend';
import { contestViewContestsReducer } from './contest-view-contests.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestViewContests', contestViewContestsReducer),
    BackendModule.forFeature('contestViewContests', contestViewContestsBackend),
  ],
})
export class DatastoreContestViewContestsModule {}
