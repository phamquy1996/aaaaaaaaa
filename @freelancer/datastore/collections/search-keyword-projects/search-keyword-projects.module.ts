import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchKeywordProjectsBackend } from './search-keyword-projects.backend';
import { searchKeywordProjectsReducer } from './search-keyword-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'searchKeywordProjects',
      searchKeywordProjectsReducer,
    ),
    BackendModule.forFeature(
      'searchKeywordProjects',
      searchKeywordProjectsBackend,
    ),
  ],
})
export class DatastoreSearchKeywordProjectsModule {}
