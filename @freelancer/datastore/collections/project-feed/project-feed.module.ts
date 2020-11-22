import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectFeedBackend } from './project-feed.backend';
import { projectFeedReducer } from './project-feed.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectFeed', projectFeedReducer),
    BackendModule.forFeature('projectFeed', projectFeedBackend),
  ],
})
export class DatastoreProjectFeedModule {}
