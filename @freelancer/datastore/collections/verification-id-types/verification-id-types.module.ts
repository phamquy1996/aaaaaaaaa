import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { verificationIdTypeBackend } from './verification-id-types.backend';
import { verificationIdTypeReducer } from './verification-id-types.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('verificationIdTypes', verificationIdTypeReducer),
    BackendModule.forFeature('verificationIdTypes', verificationIdTypeBackend),
  ],
})
export class DatastoreVerificationIdTypesModule {}
