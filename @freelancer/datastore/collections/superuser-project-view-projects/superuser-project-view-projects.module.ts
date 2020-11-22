import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { superuserProjectViewProjectsBackend } from './superuser-project-view-projects.backend';
import { superuserProjectViewProjectsReducer } from './superuser-project-view-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'superuserProjectViewProjects',
      superuserProjectViewProjectsReducer,
    ),
    BackendModule.forFeature(
      'superuserProjectViewProjects',
      superuserProjectViewProjectsBackend,
    ),
  ],
})
export class DatastoreSuperuserProjectViewProjectsModule {}
