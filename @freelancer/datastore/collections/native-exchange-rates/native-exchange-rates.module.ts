import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { nativeExchangeRatesBackend } from './native-exchange-rates.backend';
import { nativeExchangeRatesReducer } from './native-exchange-rates.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('nativeExchangeRates', nativeExchangeRatesReducer),
    BackendModule.forFeature('nativeExchangeRates', nativeExchangeRatesBackend),
  ],
})
export class DatastoreNativeExchangeRatesModule {}
