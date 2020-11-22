import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { groupPermissionsBackend } from './group-permissions.backend';
import { groupPermissionsReducer } from './group-permissions.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('groupPermissions', groupPermissionsReducer),
    BackendModule.forFeature('groupPermissions', groupPermissionsBackend),
  ],
})
export class DatastoreGroupPermissionsModule {}
