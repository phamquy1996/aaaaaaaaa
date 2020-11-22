import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { manageViewOpenProjectsBackend } from './manage-view-open-projects.backend';
import { manageViewOpenProjectsReducer } from './manage-view-open-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'manageViewOpenProjects',
      manageViewOpenProjectsReducer,
    ),
    BackendModule.forFeature(
      'manageViewOpenProjects',
      manageViewOpenProjectsBackend,
    ),
  ],
})
export class DatastoreManageViewOpenProjectsModule {}
