import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestEntryMessagesBackend } from './contest-entry-messages.backend';
import { contestEntryMessagesReducer } from './contest-entry-messages.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestEntryMessages', contestEntryMessagesReducer),
    BackendModule.forFeature(
      'contestEntryMessages',
      contestEntryMessagesBackend,
    ),
  ],
})
export class DatastoreContestEntryMessagesModule {}
