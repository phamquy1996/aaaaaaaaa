import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { portfoliosBackend } from './portfolios.backend';
import { portfoliosReducer } from './portfolios.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('portfolios', portfoliosReducer),
    BackendModule.forFeature('portfolios', portfoliosBackend),
  ],
})
export class DatastorePortfoliosModule {}
