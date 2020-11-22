import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { referralInvitationCheckBackend } from './referral-invitation-check.backend';
import { referralInvitationCheckReducer } from './referral-invitation-check.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'referralInvitationCheck',
      referralInvitationCheckReducer,
    ),
    BackendModule.forFeature(
      'referralInvitationCheck',
      referralInvitationCheckBackend,
    ),
  ],
})
export class DatastoreReferralInvitationCheckModule {}
