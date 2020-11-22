import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectInviteBackend } from './project-invite.backend';
import { projectInviteReducer } from './project-invite.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectInvite', projectInviteReducer),
    BackendModule.forFeature('projectInvite', projectInviteBackend),
  ],
})
export class DatastoreProjectInviteModule {}
