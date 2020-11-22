import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { membershipBenefitsBackend } from './membership-benefits.backend';
import { membershipBenefitsReducer } from './membership-benefits.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('membershipBenefits', membershipBenefitsReducer),
    BackendModule.forFeature('membershipBenefits', membershipBenefitsBackend),
  ],
})
export class DatastoreMembershipBenefitsModule {}
