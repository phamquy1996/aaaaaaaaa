import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { agentsBackend } from './agents.backend';
import { agentsReducer } from './agents.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('agents', agentsReducer),
    BackendModule.forFeature('agents', agentsBackend),
  ],
})
export class DatastoreAgentsModule {}
