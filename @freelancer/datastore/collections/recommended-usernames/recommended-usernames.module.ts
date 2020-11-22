import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { recommendedUsernamesBackend } from './recommended-usernames.backend';
import { recommendedUsernamesReducer } from './recommended-usernames.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('recommendedUsernames', recommendedUsernamesReducer),
    BackendModule.forFeature(
      'recommendedUsernames',
      recommendedUsernamesBackend,
    ),
  ],
})
export class DatastoreRecommendedUsernamesModule {}
