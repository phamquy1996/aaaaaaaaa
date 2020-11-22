import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { tracksBackend } from './tracks.backend';
import { tracksReducer } from './tracks.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('tracks', tracksReducer),
    BackendModule.forFeature('tracks', tracksBackend),
  ],
})
export class DatastoreTracksModule {}
