import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectsBackend } from './projects.backend';
import { projectsReducer } from './projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projects', projectsReducer),
    BackendModule.forFeature('projects', projectsBackend),
  ],
})
export class DatastoreProjectsModule {}
