import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectViewUsersBackend } from './project-view-users.backend';
import { projectViewUsersReducer } from './project-view-users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectViewUsers', projectViewUsersReducer),
    BackendModule.forFeature('projectViewUsers', projectViewUsersBackend),
  ],
})
export class DatastoreProjectViewUsersModule {}
