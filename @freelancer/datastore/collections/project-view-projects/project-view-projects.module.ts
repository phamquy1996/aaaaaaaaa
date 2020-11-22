import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectViewProjectsBackend } from './project-view-projects.backend';
import { projectViewProjectsReducer } from './project-view-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectViewProjects', projectViewProjectsReducer),
    BackendModule.forFeature('projectViewProjects', projectViewProjectsBackend),
  ],
})
export class DatastoreProjectViewProjectsModule {}
