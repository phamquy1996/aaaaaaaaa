import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { academyPriceTiersBackend } from './academy-price-tiers.backend';
import { academyPriceTiersReducer } from './academy-price-tiers.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('academyPriceTiers', academyPriceTiersReducer),
    BackendModule.forFeature('academyPriceTiers', academyPriceTiersBackend),
  ],
})
export class DatastoreAcademyPriceTiersModule {}
