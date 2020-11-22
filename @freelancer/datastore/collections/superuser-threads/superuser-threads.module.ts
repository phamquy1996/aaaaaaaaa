import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { superuserThreadsBackend } from './superuser-threads.backend';
import { superuserThreadsReducer } from './superuser-threads.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('superuserThreads', superuserThreadsReducer),
    BackendModule.forFeature('superuserThreads', superuserThreadsBackend),
  ],
})
export class DatastoreSuperuserThreadsModule {}
