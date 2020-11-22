import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectFeedFailingProjectsBackend } from './project-feed-failing-projects.backend';
import { projectFeedFailingProjectsReducer } from './project-feed-failing-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'projectFeedFailingProjects',
      projectFeedFailingProjectsReducer,
    ),
    BackendModule.forFeature(
      'projectFeedFailingProjects',
      projectFeedFailingProjectsBackend,
    ),
  ],
})
export class DatastoreProjectFeedFailingProjectsModule {}
