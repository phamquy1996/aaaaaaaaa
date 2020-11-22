import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { membershipPackagePricesBackend } from './membership-package-prices.backend';
import { membershipPackagePricesReducer } from './membership-package-prices.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'membershipPackagePrices',
      membershipPackagePricesReducer,
    ),
    BackendModule.forFeature(
      'membershipPackagePrices',
      membershipPackagePricesBackend,
    ),
  ],
})
export class DatastoreMembershipPackagePricesModule {}
