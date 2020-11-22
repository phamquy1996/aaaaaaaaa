import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestHasInvoiceBackend } from './contest-has-invoices.backend';
import { contestHasInvoiceReducer } from './contest-has-invoices.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestHasInvoices', contestHasInvoiceReducer),
    BackendModule.forFeature('contestHasInvoices', contestHasInvoiceBackend),
  ],
})
export class DatastoreContestHasInvoicesModule {}
