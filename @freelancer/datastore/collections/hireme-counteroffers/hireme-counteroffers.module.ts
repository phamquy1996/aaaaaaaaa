import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { hiremeCounterofferBackend } from './hireme-counteroffers.backend';
import { hiremeCounterofferReducer } from './hireme-counteroffers.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('hiremeCounteroffers', hiremeCounterofferReducer),
    BackendModule.forFeature('hiremeCounteroffers', hiremeCounterofferBackend),
  ],
})
export class DatastoreHiremeCounteroffersModule {}
