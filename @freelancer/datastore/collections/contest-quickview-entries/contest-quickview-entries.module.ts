import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestQuickviewEntriesBackend } from './contest-quickview-entries.backend';
import { contestQuickviewEntriesReducer } from './contest-quickview-entries.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'contestQuickviewEntries',
      contestQuickviewEntriesReducer,
    ),
    BackendModule.forFeature(
      'contestQuickviewEntries',
      contestQuickviewEntriesBackend,
    ),
  ],
})
export class DatastoreContestQuickviewEntriesModule {}
