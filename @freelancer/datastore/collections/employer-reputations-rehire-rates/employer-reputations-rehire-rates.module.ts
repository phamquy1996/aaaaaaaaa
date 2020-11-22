import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { employerReputationsRehireRatesBackend } from './employer-reputations-rehire-rates.backend';
import { employerReputationsRehireRatesReducer } from './employer-reputations-rehire-rates.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'employerReputationsRehireRates',
      employerReputationsRehireRatesReducer,
    ),
    BackendModule.forFeature(
      'employerReputationsRehireRates',
      employerReputationsRehireRatesBackend,
    ),
  ],
})
export class DatastoreEmployerReputationsRehireRatesModule {}
