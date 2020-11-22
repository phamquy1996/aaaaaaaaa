import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { currenciesBackend } from './currencies.backend';
import { currenciesReducer } from './currencies.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('currencies', currenciesReducer),
    BackendModule.forFeature('currencies', currenciesBackend),
  ],
})
export class DatastoreCurrenciesModule {}
