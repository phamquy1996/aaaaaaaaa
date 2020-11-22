import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { manageViewPastProjectsBackend } from './manage-view-past-projects.backend';
import { manageViewPastProjectsReducer } from './manage-view-past-projects.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'manageViewPastProjects',
      manageViewPastProjectsReducer,
    ),
    BackendModule.forFeature(
      'manageViewPastProjects',
      manageViewPastProjectsBackend,
    ),
  ],
})
export class DatastoreManageViewPastProjectsModule {}
