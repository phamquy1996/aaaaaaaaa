import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchAllProjectsBackend } from './search-all-projects.backend';
import { searchAllProjectsReducer } from './search-all-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchAllProjects', searchAllProjectsReducer),
    BackendModule.forFeature('searchAllProjects', searchAllProjectsBackend),
  ],
})
export class DatastoreSearchAllProjectsModule {}
