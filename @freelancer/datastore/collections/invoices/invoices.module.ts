import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { invoicesBackend } from './invoices.backend';
import { invoicesReducer } from './invoices.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('invoices', invoicesReducer),
    BackendModule.forFeature('invoices', invoicesBackend),
  ],
})
export class DatastoreInvoicesModule {}
