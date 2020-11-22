import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { bidUpgradeFeesBackend } from './bid-upgrade-fees.backend';
import { bidUpgradeFeesReducer } from './bid-upgrade-fees.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('bidUpgradeFees', bidUpgradeFeesReducer),
    BackendModule.forFeature('bidUpgradeFees', bidUpgradeFeesBackend),
  ],
})
export class DatastoreBidUpgradeFeesModule {}
