import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { currencyDetectBackend } from './currency-detect.backend';
import { currencyDetectReducer } from './currency-detect.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('currencyDetect', currencyDetectReducer),
    BackendModule.forFeature('currencyDetect', currencyDetectBackend),
  ],
})
export class DatastoreCurrencyDetectModule {}
