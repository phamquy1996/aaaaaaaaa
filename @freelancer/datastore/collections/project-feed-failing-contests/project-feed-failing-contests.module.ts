import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectFeedFailingContestsBackend } from './project-feed-failing-contests.backend';
import { projectFeedFailingContestsReducer } from './project-feed-failing-contests.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'projectFeedFailingContests',
      projectFeedFailingContestsReducer,
    ),
    BackendModule.forFeature(
      'projectFeedFailingContests',
      projectFeedFailingContestsBackend,
    ),
  ],
})
export class DatastoreProjectFeedFailingContestsModule {}
