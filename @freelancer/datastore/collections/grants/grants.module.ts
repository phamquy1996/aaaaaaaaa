import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { grantsBackend } from './grants.backend';
import { grantsReducer } from './grants.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('grants', grantsReducer),
    BackendModule.forFeature('grants', grantsBackend),
  ],
})
export class DatastoreGrantsModule {}
