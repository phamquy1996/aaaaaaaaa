import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestFilesBackend } from './contest-files.backend';
import { contestFilesReducer } from './contest-files.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestFiles', contestFilesReducer),
    BackendModule.forFeature('contestFiles', contestFilesBackend),
  ],
})
export class DatastoreContestFilesModule {}
