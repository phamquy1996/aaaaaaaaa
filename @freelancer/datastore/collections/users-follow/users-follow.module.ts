import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { usersFollowBackend } from './users-follow.backend';
import { usersFollowReducer } from './users-follow.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('usersFollow', usersFollowReducer),
    BackendModule.forFeature('usersFollow', usersFollowBackend),
  ],
})
export class DatastoreUsersFollowModule {}
