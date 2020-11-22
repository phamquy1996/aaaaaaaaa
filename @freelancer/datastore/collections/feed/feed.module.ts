import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { feedBackend } from './feed.backend';
import { feedReducer } from './feed.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('feed', feedReducer),
    BackendModule.forFeature('feed', feedBackend),
  ],
})
export class DatastoreFeedModule {}
