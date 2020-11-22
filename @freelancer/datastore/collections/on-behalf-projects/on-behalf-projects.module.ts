import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { onBehalfProjectsBackend } from './on-behalf-projects.backend';
import { onBehalfProjectsReducer } from './on-behalf-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('onBehalfProjects', onBehalfProjectsReducer),
    BackendModule.forFeature('onBehalfProjects', onBehalfProjectsBackend),
  ],
})
export class DatastoreOnBehalfProjectsModule {}
