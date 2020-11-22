import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { driveFilePermissionsBackend } from './drive-file-permissions.backend';
import { driveFilePermissionsReducer } from './drive-file-permissions.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('driveFilePermissions', driveFilePermissionsReducer),
    BackendModule.forFeature(
      'driveFilePermissions',
      driveFilePermissionsBackend,
    ),
  ],
})
export class DatastoreDriveFilePermissionsModule {}
