import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { depositPageVarsBackend } from './deposit-page-vars.backend';
import { depositPageVarsReducer } from './deposit-page-vars.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('depositPageVars', depositPageVarsReducer),
    BackendModule.forFeature('depositPageVars', depositPageVarsBackend),
  ],
})
export class DatastoreDepositPageVarsModule {}
