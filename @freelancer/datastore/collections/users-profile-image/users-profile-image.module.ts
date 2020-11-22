import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { usersProfileImageBackend } from './users-profile-image.backend';
import { usersProfileImageReducer } from './users-profile-image.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('usersProfileImage', usersProfileImageReducer),
    BackendModule.forFeature('usersProfileImage', usersProfileImageBackend),
  ],
})
export class DatastoreUsersProfileImageModule {}
