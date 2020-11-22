import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchThreadsBackend } from './search-threads.backend';
import { searchThreadsReducer } from './search-threads.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchThreads', searchThreadsReducer),
    BackendModule.forFeature('searchThreads', searchThreadsBackend),
  ],
})
export class DatastoreSearchThreadsModule {}
