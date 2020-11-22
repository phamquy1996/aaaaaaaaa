import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { currenciesBackend } from './currencies-including-external.backend';
import { currenciesReducer } from './currencies-including-external.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('currenciesIncludingExternal', currenciesReducer),
    BackendModule.forFeature('currenciesIncludingExternal', currenciesBackend),
  ],
})
export class DatastoreCurrenciesIncludingExternalModule {}
