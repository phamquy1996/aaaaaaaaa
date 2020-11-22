import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { driveFilesBackend } from './drive-files.backend';
import { driveFilesReducer } from './drive-files.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('driveFiles', driveFilesReducer),
    BackendModule.forFeature('driveFiles', driveFilesBackend),
  ],
})
export class DatastoreDriveFilesModule {}
