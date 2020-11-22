import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { profileCategoriesBackend } from './profile-categories.backend';
import { profileCategoriesReducer } from './profile-categories.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('profileCategories', profileCategoriesReducer),
    BackendModule.forFeature('profileCategories', profileCategoriesBackend),
  ],
})
export class DatastoreProfileCategoriesModule {}
