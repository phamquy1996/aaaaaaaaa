import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { postFilesBackend } from './post-files.backend';
import { postFilesReducer } from './post-files.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('postFiles', postFilesReducer),
    BackendModule.forFeature('postFiles', postFilesBackend),
  ],
})
export class DatastorePostFilesModule {}
