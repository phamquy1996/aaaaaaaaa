import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { transactionHistoryDetailsBackend } from './transaction-history-details.backend';
import { transactionHistoryDetailsReducer } from './transaction-history-details.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'transactionHistoryDetails',
      transactionHistoryDetailsReducer,
    ),
    BackendModule.forFeature(
      'transactionHistoryDetails',
      transactionHistoryDetailsBackend,
    ),
  ],
})
export class DatastoreTransactionHistoryDetailsModule {}
