import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { QueueEventType } from './agent-sessions.model';
import {
  transformAgentSession,
  transformAgentSessions,
} from './agent-sessions.transformers';
import { AgentSessionsCollection } from './agent-sessions.types';

export function agentSessionsReducer(
  state: CollectionStateSlice<AgentSessionsCollection> = {},
  action: CollectionActions<AgentSessionsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'agentSessions') {
        const { result, ref, order } = action.payload;

        if (result.agent_sessions && result.sessions) {
          return mergeDocuments<AgentSessionsCollection>(
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

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'agentSessions') {
        const { originalDocument, result, ref } = action.payload;

        return mergeWebsocketDocuments<AgentSessionsCollection>(
          state,
          // This transforms the result AgentSessionApi and merges it over
          // the original object.
          transformIntoDocuments(
            [result.agent_session],
            transformAgentSession,
            originalDocument,
          ),
          ref,
        );
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
                  collection: 'agentSessions',
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
                  collection: 'agentSessions',
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
