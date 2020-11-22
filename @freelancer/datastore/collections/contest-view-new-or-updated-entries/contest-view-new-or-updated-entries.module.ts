import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestViewNewOrUpdatedEntriesBackend } from './contest-view-new-or-updated-entries.backend';
import { contestViewNewOrUpdatedEntriesReducer } from './contest-view-new-or-updated-entries.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'contestViewNewOrUpdatedEntries',
      contestViewNewOrUpdatedEntriesReducer,
    ),
    BackendModule.forFeature(
      'contestViewNewOrUpdatedEntries',
      contestViewNewOrUpdatedEntriesBackend,
    ),
  ],
})
export class DatastoreContestViewNewOrUpdatedEntriesModule {}
