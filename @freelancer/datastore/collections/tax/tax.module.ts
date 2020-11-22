import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { taxBackend } from './tax.backend';
import { taxReducer } from './tax.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('tax', taxReducer),
    BackendModule.forFeature('tax', taxBackend),
  ],
})
export class DatastoreTaxModule {}
