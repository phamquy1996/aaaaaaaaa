import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { manageViewOngoingProjectsBackend } from './manage-view-ongoing-projects.backend';
import { manageViewOngoingProjectsReducer } from './manage-view-ongoing-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'manageViewOngoingProjects',
      manageViewOngoingProjectsReducer,
    ),
    BackendModule.forFeature(
      'manageViewOngoingProjects',
      manageViewOngoingProjectsBackend,
    ),
  ],
})
export class DatastoreManageViewOngoingProjectsModule {}
