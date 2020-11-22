import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { categoryPageViewUsersBackend } from './category-page-view-users.backend';
import { categoryPageViewUsersReducer } from './category-page-view-users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'categoryPageViewUsers',
      categoryPageViewUsersReducer,
    ),
    BackendModule.forFeature(
      'categoryPageViewUsers',
      categoryPageViewUsersBackend,
    ),
  ],
})
export class DatastoreCategoryPageViewUsersModule {}
