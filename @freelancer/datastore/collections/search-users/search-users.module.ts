import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchUsersBackend } from './search-users.backend';
import { searchUsersReducer } from './search-users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchUsers', searchUsersReducer),
    BackendModule.forFeature('searchUsers', searchUsersBackend),
  ],
})
export class DatastoreSearchUsersModule {}
