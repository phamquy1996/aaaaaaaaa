import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { hourlyContractsBackend } from './hourly-contracts.backend';
import { hourlyContractsReducer } from './hourly-contracts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('hourlyContracts', hourlyContractsReducer),
    BackendModule.forFeature('hourlyContracts', hourlyContractsBackend),
  ],
})
export class DatastoreHourlyContractsModule {}
