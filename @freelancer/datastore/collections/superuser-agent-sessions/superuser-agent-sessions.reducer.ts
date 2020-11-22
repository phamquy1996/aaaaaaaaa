import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { QueueEventType } from '../agent-sessions/agent-sessions.model';
import { transformAgentSessions } from '../agent-sessions/agent-sessions.transformers';
import { SuperuserAgentSessionsCollection } from './superuser-agent-sessions.types';

export function agentSessionsReducer(
  state: CollectionStateSlice<SuperuserAgentSessionsCollection> = {},
  action: CollectionActions<SuperuserAgentSessionsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'superuserAgentSessions') {
        const { result, ref, order } = action.payload;

        if (result.agent_sessions && result.sessions) {
          return mergeDocuments<SuperuserAgentSessionsCollection>(
            state,
            // This transforms and flattens together AgentSessionApi's with
            // their associated SessionApi obejcts to make a single
            // AgentSession object.
            transformIntoDocuments(
              result.agent_sessions,
              transformAgentSessions,
              result.sessions,
            ),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const { payload } = action;
      if (payload.type === 'supportQueueEvent') {
        switch (payload.data.queueEventType) {
          case QueueEventType.ENQUEUE:
          case QueueEventType.REASSIGN:
            return addWebsocketDocuments(
              state,
              payload.data.agent_sessions,
              transformAgentSessions,
              {
                path: {
                  collection: 'superuserAgentSessions',
                  authUid: payload.toUserId,
                },
              },
              payload.data.sessions,
            );
          default:
            return state;
        }
      }

      if (payload.type === 'supportAgentSession') {
        switch (payload.data.type) {
          case 'created':
          case 'assigned':
          case 'resolved':
          case 'starred':
            return addWebsocketDocuments(
              state,
              [payload.data.agentSession],
              transformAgentSessions,
              {
                path: {
                  collection: 'superuserAgentSessions',
                  authUid: payload.toUserId,
                },
              },
              { [payload.data.session.id]: payload.data.session },
            );
          default:
            return state;
        }
      }

      return state;
    }

    default:
      return state;
  }
}
