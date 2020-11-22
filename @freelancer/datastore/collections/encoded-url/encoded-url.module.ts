import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { encodedUrlBackend } from './encoded-url.backend';
import { encodedUrlReducer } from './encoded-url.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('encodedUrl', encodedUrlReducer),
    BackendModule.forFeature('encodedUrl', encodedUrlBackend),
  ],
})
export class DatastoreEncodedUrlModule {}
