import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { transactionHistoryItemsBackend } from './transaction-history-items.backend';
import { transactionHistoryItemsReducer } from './transaction-history-items.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'transactionHistoryItems',
      transactionHistoryItemsReducer,
    ),
    BackendModule.forFeature(
      'transactionHistoryItems',
      transactionHistoryItemsBackend,
    ),
  ],
})
export class DatastoreTransactionHistoryItemsModule {}
