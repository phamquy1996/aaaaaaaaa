import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestEntryOffersBackend } from './contest-entry-offers.backend';
import { contestEntryOffersReducer } from './contest-entry-offers.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestEntryOffers', contestEntryOffersReducer),
    BackendModule.forFeature('contestEntryOffers', contestEntryOffersBackend),
  ],
})
export class DatastoreContestEntryOffersModule {}
