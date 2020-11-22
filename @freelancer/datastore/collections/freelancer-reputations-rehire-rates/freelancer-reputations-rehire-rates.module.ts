import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { freelancerReputationsRehireRatesBackend } from './freelancer-reputations-rehire-rates.backend';
import { freelancerReputationsRehireRatesReducer } from './freelancer-reputations-rehire-rates.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'freelancerReputationsRehireRates',
      freelancerReputationsRehireRatesReducer,
    ),
    BackendModule.forFeature(
      'freelancerReputationsRehireRates',
      freelancerReputationsRehireRatesBackend,
    ),
  ],
})
export class DatastoreFreelancerReputationsRehireRatesModule {}
