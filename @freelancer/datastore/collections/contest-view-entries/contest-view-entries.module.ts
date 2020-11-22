import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestViewEntriesBackend } from './contest-view-entries.backend';
import { contestViewEntriesReducer } from './contest-view-entries.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestViewEntries', contestViewEntriesReducer),
    BackendModule.forFeature('contestViewEntries', contestViewEntriesBackend),
  ],
})
export class DatastoreContestViewEntriesModule {}
