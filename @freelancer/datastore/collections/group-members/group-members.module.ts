import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { groupMembersBackend } from './group-members.backend';
import { groupMembersReducer } from './group-members.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('groupMembers', groupMembersReducer),
    BackendModule.forFeature('groupMembers', groupMembersBackend),
  ],
})
export class DatastoreGroupMembersModule {}
