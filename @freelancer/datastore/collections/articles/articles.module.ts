import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { articlesBackend } from './articles.backend';
import { articlesReducer } from './articles.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('articles', articlesReducer),
    BackendModule.forFeature('articles', articlesBackend),
  ],
})
export class DatastoreArticlesModule {}
