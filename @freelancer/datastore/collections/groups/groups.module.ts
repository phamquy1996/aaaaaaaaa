import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { groupsBackend } from './groups.backend';
import { groupsReducer } from './groups.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('groups', groupsReducer),
    BackendModule.forFeature('groups', groupsBackend),
  ],
})
export class DatastoreGroupsModule {}
