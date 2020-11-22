import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestMessagesBackend } from './contest-messages.backend';
import { contestMessagesReducer } from './contest-messages.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestMessages', contestMessagesReducer),
    BackendModule.forFeature('contestMessages', contestMessagesBackend),
  ],
})
export class DatastoreContestMessagesModule {}
