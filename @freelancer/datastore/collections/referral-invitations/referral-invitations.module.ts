import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { referralInvitationsBackend } from './referral-invitations.backend';
import { referralInvitationsReducer } from './referral-invitations.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('referralInvitations', referralInvitationsReducer),
    BackendModule.forFeature('referralInvitations', referralInvitationsBackend),
  ],
})
export class DatastoreReferralInvitationsModule {}
