import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestInviteBackend } from './contest-invite.backend';
import { contestInviteReducer } from './contest-invite.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestInvite', contestInviteReducer),
    BackendModule.forFeature('contestInvite', contestInviteBackend),
  ],
})
export class DatastoreContestInviteModule {}
