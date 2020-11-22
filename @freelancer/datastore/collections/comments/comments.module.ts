import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { commentsBackend } from './comments.backend';
import { commentsReducer } from './comments.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('comments', commentsReducer),
    BackendModule.forFeature('comments', commentsBackend),
  ],
})
export class DatastoreCommentsModule {}
