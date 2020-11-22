import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { feedPostsBackend } from './feed-posts.backend';
import { feedPostsReducer } from './feed-posts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('feedPosts', feedPostsReducer),
    BackendModule.forFeature('feedPosts', feedPostsBackend),
  ],
})
export class DatastoreFeedPostsModule {}
