import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { academyCategoriesBackend } from './academy-categories.backend';
import { academyCategoriesReducer } from './academy-categories.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('academyCategories', academyCategoriesReducer),
    BackendModule.forFeature('academyCategories', academyCategoriesBackend),
  ],
})
export class DatastoreAcademyCategoriesModule {}
