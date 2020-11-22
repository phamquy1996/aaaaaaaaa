import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { nearbyProjectsBackend } from './nearby-projects.backend';
import { nearbyProjectsReducer } from './nearby-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('nearbyProjects', nearbyProjectsReducer),
    BackendModule.forFeature('nearbyProjects', nearbyProjectsBackend),
  ],
})
export class DatastoreNearbyProjectsModule {}
