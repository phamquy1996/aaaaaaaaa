import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { newsfeedBackend } from './newsfeed.backend';
import { newsfeedReducer } from './newsfeed.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('newsfeed', newsfeedReducer),
    BackendModule.forFeature('newsfeed', newsfeedBackend),
  ],
})
export class DatastoreNewsfeedModule {}
