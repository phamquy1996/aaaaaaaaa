import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { usersLocationBackend } from './users-location.backend';
import { usersLocationReducer } from './users-location.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('usersLocation', usersLocationReducer),
    BackendModule.forFeature('usersLocation', usersLocationBackend),
  ],
})
export class DatastoreUsersLocationModule {}
