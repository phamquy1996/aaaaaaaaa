import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { usersRecommendBackend } from './users-recommend.backend';
import { usersRecommendReducer } from './users-recommend.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('usersRecommend', usersRecommendReducer),
    BackendModule.forFeature('usersRecommend', usersRecommendBackend),
  ],
})
export class DatastoreUsersRecommendModule {}
