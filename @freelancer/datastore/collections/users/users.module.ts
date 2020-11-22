import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { usersBackend } from './users.backend';
import { usersReducer } from './users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('users', usersReducer),
    BackendModule.forFeature('users', usersBackend),
  ],
})
export class DatastoreUsersModule {}
