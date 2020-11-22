import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { usersProfileBackend } from './users-profile.backend';
import { usersProfileReducer } from './users-profile.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('usersProfile', usersProfileReducer),
    BackendModule.forFeature('usersProfile', usersProfileBackend),
  ],
})
export class DatastoreUsersProfileModule {}
