import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { superuserSearchThreadsBackend } from './superuser-search-threads.backend';
import { superuserSearchThreadsReducer } from './superuser-search-threads.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'superuserSearchThreads',
      superuserSearchThreadsReducer,
    ),
    BackendModule.forFeature(
      'superuserSearchThreads',
      superuserSearchThreadsBackend,
    ),
  ],
})
export class DatastoreSuperuserSearchThreadsModule {}
