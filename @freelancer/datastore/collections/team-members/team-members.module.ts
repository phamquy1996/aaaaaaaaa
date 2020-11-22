import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { teamMembersBackend } from './team-members.backend';
import { teamMembersReducer } from './team-members.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('teamMembers', teamMembersReducer),
    BackendModule.forFeature('teamMembers', teamMembersBackend),
  ],
})
export class DatastoreTeamMembersModule {}
