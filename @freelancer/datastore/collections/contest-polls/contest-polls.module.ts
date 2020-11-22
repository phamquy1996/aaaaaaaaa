import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestPollsBackend } from './contest-polls.backend';
import { contestPollsReducer } from './contest-polls.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestPolls', contestPollsReducer),
    BackendModule.forFeature('contestPolls', contestPollsBackend),
  ],
})
export class DatastoreContestPollsModule {}
