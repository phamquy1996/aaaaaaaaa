import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userPendingFundsBackend } from './user-pending-funds.backend';
import { userPendingFundsReducer } from './user-pending-funds.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userPendingFunds', userPendingFundsReducer),
    BackendModule.forFeature('userPendingFunds', userPendingFundsBackend),
  ],
})
export class DatastoreUserPendingFundsModule {}
