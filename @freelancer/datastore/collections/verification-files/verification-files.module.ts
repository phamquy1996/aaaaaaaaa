import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { verificationFilesBackend } from './verification-files.backend';
import { verificationFilesReducer } from './verification-files.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('verificationFiles', verificationFilesReducer),
    BackendModule.forFeature('verificationFiles', verificationFilesBackend),
  ],
})
export class DatastoreVerificationFilesModule {}
