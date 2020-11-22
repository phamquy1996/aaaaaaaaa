import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { agentSessionsBackend } from './superuser-agent-sessions.backend';
import { agentSessionsReducer } from './superuser-agent-sessions.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('superuserAgentSessions', agentSessionsReducer),
    BackendModule.forFeature('superuserAgentSessions', agentSessionsBackend),
  ],
})
export class DatastoreSuperuserAgentSessionsModule {}
