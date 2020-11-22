import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userIsArrowWhitelistedBackend } from './user-is-arrow-whitelisted.backend';
import { userIsArrowWhitelistedReducer } from './user-is-arrow-whitelisted.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'userIsArrowWhitelisted',
      userIsArrowWhitelistedReducer,
    ),
    BackendModule.forFeature(
      'userIsArrowWhitelisted',
      userIsArrowWhitelistedBackend,
    ),
  ],
})
export class DatastoreUserIsArrowWhitelistedModule {}
