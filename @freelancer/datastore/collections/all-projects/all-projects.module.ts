import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { allProjectsBackend } from './all-projects.backend';
import { allProjectsReducer } from './all-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('allProjects', allProjectsReducer),
    BackendModule.forFeature('allProjects', allProjectsBackend),
  ],
})
export class DatastoreAllProjectsModule {}
