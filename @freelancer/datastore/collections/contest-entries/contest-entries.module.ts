import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestEntriesBackend } from './contest-entries.backend';
import { contestEntriesReducer } from './contest-entries.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestEntries', contestEntriesReducer),
    BackendModule.forFeature('contestEntries', contestEntriesBackend),
  ],
})
export class DatastoreContestEntriesModule {}
