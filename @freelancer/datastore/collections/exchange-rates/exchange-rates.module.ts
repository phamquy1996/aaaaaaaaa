import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { exchangeRatesBackend } from './exchange-rates.backend';
import { exchangeRatesReducer } from './exchange-rates.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('exchangeRates', exchangeRatesReducer),
    BackendModule.forFeature('exchangeRates', exchangeRatesBackend),
  ],
})
export class DatastoreExchangeRatesModule {}
