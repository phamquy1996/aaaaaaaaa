import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { agentSessionsBackend } from './agent-sessions.backend';
import { agentSessionsReducer } from './agent-sessions.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('agentSessions', agentSessionsReducer),
    BackendModule.forFeature('agentSessions', agentSessionsBackend),
  ],
})
export class DatastoreAgentSessionsModule {}
