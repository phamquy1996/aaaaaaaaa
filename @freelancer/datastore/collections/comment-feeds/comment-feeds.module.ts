import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { commentFeedsBackend } from './comment-feeds.backend';
import { commentFeedsReducer } from './comment-feeds.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('commentFeeds', commentFeedsReducer),
    BackendModule.forFeature('commentFeeds', commentFeedsBackend),
  ],
})
export class DatastoreCommentFeedsModule {}
