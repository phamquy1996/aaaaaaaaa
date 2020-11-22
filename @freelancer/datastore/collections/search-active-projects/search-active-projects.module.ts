import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchActiveProjectsBackend } from './search-active-projects.backend';
import { searchActiveProjectsReducer } from './search-active-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchActiveProjects', searchActiveProjectsReducer),
    BackendModule.forFeature(
      'searchActiveProjects',
      searchActiveProjectsBackend,
    ),
  ],
})
export class DatastoreSearchActiveProjectsModule {}
