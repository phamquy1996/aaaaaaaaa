import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { universitiesBackend } from './universities.backend';
import { universitiesReducer } from './universities.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('universities', universitiesReducer),
    BackendModule.forFeature('universities', universitiesBackend),
  ],
})
export class DatastoreUniversitiesModule {}
