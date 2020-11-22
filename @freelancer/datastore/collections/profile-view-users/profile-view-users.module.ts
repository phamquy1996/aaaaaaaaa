import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { profileViewUsersBackend } from './profile-view-users.backend';
import { profileViewUsersReducer } from './profile-view-users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('profileViewUsers', profileViewUsersReducer),
    BackendModule.forFeature('profileViewUsers', profileViewUsersBackend),
  ],
})
export class DatastoreProfileViewUsersModule {}
