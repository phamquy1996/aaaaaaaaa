import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { hirePageDetailsBackend } from './hire-page-details.backend';
import { hirePageDetailsReducer } from './hire-page-details.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('hirePageDetails', hirePageDetailsReducer),
    BackendModule.forFeature('hirePageDetails', hirePageDetailsBackend),
  ],
})
export class DatastoreHirePageDetailsModule {}
