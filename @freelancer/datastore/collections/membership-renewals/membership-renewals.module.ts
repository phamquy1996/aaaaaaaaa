import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { membershipRenewalsBackend } from './membership-renewals.backend';
import { membershipRenewalsReducer } from './membership-renewals.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('membershipRenewals', membershipRenewalsReducer),
    BackendModule.forFeature('membershipRenewals', membershipRenewalsBackend),
  ],
})
export class DatastoreMembershipRenewalsModule {}
