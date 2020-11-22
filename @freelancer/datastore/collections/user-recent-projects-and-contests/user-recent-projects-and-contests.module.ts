import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userRecentProjectsAndContestsBackend } from './user-recent-projects-and-contests.backend';
import { userRecentProjectsAndContestsReducer } from './user-recent-projects-and-contests.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'userRecentProjectsAndContests',
      userRecentProjectsAndContestsReducer,
    ),
    BackendModule.forFeature(
      'userRecentProjectsAndContests',
      userRecentProjectsAndContestsBackend,
    ),
  ],
})
export class DatastoreUserRecentProjectsAndContestsModule {}
