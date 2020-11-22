import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectBookmarksBackend } from './project-bookmarks.backend';
import { projectBookmarksReducer } from './project-bookmarks.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectBookmarks', projectBookmarksReducer),
    BackendModule.forFeature('projectBookmarks', projectBookmarksBackend),
  ],
})
export class DatastoreProjectBookmarksModule {}
