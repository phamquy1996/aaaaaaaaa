import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userDepositMethodsBackend } from './user-deposit-methods.backend';
import { userDepositMethodsReducer } from './user-deposit-methods.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userDepositMethods', userDepositMethodsReducer),
    BackendModule.forFeature('userDepositMethods', userDepositMethodsBackend),
  ],
})
export class DatastoreUserDepositMethodsModule {}
