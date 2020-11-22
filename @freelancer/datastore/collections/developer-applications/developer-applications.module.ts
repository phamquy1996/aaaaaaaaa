import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { developerApplicationsBackend } from './developer-applications.backend';
import { developerApplicationsReducer } from './developer-applications.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'developerApplications',
      developerApplicationsReducer,
    ),
    BackendModule.forFeature(
      'developerApplications',
      developerApplicationsBackend,
    ),
  ],
})
export class DatastoreDeveloperApplicationsModule {}
