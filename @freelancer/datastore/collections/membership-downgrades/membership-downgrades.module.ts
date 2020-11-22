import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { membershipDowngradesBackend } from './membership-downgrades.backend';
import { membershipDowngradesReducer } from './membership-downgrades.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('membershipDowngrades', membershipDowngradesReducer),
    BackendModule.forFeature(
      'membershipDowngrades',
      membershipDowngradesBackend,
    ),
  ],
})
export class DatastoreMembershipDowngradesModule {}
