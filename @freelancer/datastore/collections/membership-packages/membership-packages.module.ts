import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { membershipPackagesBackend } from './membership-packages.backend';
import { membershipPackagesReducer } from './membership-packages.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('membershipPackages', membershipPackagesReducer),
    BackendModule.forFeature('membershipPackages', membershipPackagesBackend),
  ],
})
export class DatastoreMembershipPackagesModule {}
