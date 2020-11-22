import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userRequiresEmailVerificationBackend } from './user-requires-email-verification.backend';
import { userRequiresEmailVerificationReducer } from './user-requires-email-verification.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'userRequiresEmailVerification',
      userRequiresEmailVerificationReducer,
    ),
    BackendModule.forFeature(
      'userRequiresEmailVerification',
      userRequiresEmailVerificationBackend,
    ),
  ],
})
export class DatastoreUserRequiresEmailVerificationModule {}
