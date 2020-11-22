import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { superuserProjectViewUsersBackend } from './superuser-project-view-users.backend';
import { superuserProjectViewUsersReducer } from './superuser-project-view-users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'superuserProjectViewUsers',
      superuserProjectViewUsersReducer,
    ),
    BackendModule.forFeature(
      'superuserProjectViewUsers',
      superuserProjectViewUsersBackend,
    ),
  ],
})
export class DatastoreSuperuserProjectViewUsersModule {}
