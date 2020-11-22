import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectUpgradeFeesBackend } from './project-upgrade-fees.backend';
import { projectUpgradeFeesReducer } from './project-upgrade-fees.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectUpgradeFees', projectUpgradeFeesReducer),
    BackendModule.forFeature('projectUpgradeFees', projectUpgradeFeesBackend),
  ],
})
export class DatastoreProjectUpgradeFeesModule {}
