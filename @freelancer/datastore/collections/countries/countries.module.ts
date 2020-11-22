import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { countriesBackend } from './countries.backend';
import { countriesReducer } from './countries.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('countries', countriesReducer),
    BackendModule.forFeature('countries', countriesBackend),
  ],
})
export class DatastoreCountriesModule {}
