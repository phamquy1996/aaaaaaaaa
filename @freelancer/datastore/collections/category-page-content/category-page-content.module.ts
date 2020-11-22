import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { categoryPageContentBackend } from './category-page-content.backend';
import { categoryPageContentReducer } from './category-page-content.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('categoryPageContent', categoryPageContentReducer),
    BackendModule.forFeature('categoryPageContent', categoryPageContentBackend),
  ],
})
export class DatastoreCategoryPageContentModule {}
