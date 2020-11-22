import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { ipContractsBackend } from './ip-contracts.backend';
import { ipContractsReducer } from './ip-contracts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('ipContracts', ipContractsReducer),
    BackendModule.forFeature('ipContracts', ipContractsBackend),
  ],
})
export class DatastoreIpContractsModule {}
