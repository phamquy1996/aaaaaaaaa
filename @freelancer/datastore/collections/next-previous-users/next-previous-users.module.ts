import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { nextPreviousUsersBackend } from './next-previous-users.backend';
import { nextPreviousUsersReducer } from './next-previous-users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('nextPreviousUsers', nextPreviousUsersReducer),
    BackendModule.forFeature('nextPreviousUsers', nextPreviousUsersBackend),
  ],
})
export class DatastoreNextPreviousUsersModule {}
