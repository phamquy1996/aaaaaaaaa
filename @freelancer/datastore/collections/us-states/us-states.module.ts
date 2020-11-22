import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { usStatesBackend } from './us-states.backend';
import { usStatesReducer } from './us-states.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('usStates', usStatesReducer),
    BackendModule.forFeature('usStates', usStatesBackend),
  ],
})
export class DatastoreUsStatesModule {}
