import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestViewEntryIdsBackend } from './contest-view-entry-ids.backend';
import { contestViewEntryIdsReducer } from './contest-view-entry-ids.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestViewEntryIds', contestViewEntryIdsReducer),
    BackendModule.forFeature('contestViewEntryIds', contestViewEntryIdsBackend),
  ],
})
export class DatastoreContestViewEntryIdsModule {}
