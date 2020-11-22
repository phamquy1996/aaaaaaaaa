import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { threadProjectsBackend } from './thread-projects.backend';
import { threadProjectsReducer } from './thread-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('threadProjects', threadProjectsReducer),
    BackendModule.forFeature('threadProjects', threadProjectsBackend),
  ],
})
export class DatastoreThreadProjectsModule {}
