import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { depositFeesBackend } from './deposit-fees.backend';
import { depositFeesReducer } from './deposit-fees.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('depositFees', depositFeesReducer),
    BackendModule.forFeature('depositFees', depositFeesBackend),
  ],
})
export class DatastoreDepositFeesModule {}
