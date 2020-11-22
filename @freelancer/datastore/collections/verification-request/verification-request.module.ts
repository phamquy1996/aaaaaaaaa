import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { verificationRequestBackend } from './verification-request.backend';
import { verificationRequestReducer } from './verification-request.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('verificationRequest', verificationRequestReducer),
    BackendModule.forFeature('verificationRequest', verificationRequestBackend),
  ],
})
export class DatastoreVerificationRequestModule {}
