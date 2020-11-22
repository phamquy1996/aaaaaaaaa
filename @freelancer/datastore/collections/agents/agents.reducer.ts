import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { Agent } from './agents.model';
import { transformAgents } from './agents.transformers';
import { AgentsCollection } from './agents.types';

export function agentsReducer(
  state: CollectionStateSlice<AgentsCollection> = {},
  action: CollectionActions<AgentsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'agents') {
        const { result, ref, order } = action.payload;
        if (result.agents) {
          return mergeDocuments<AgentsCollection>(
            state,
            transformIntoDocuments(result.agents, transformAgents),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }

    case 'API_UPDATE': {
      if (action.payload.type === 'agents') {
        const { delta, ref, originalDocument } = action.payload;

        return mergeWebsocketDocuments<AgentsCollection>(
          state,
          transformIntoDocuments(
            [deepSpread(originalDocument, delta)],
            (a: Agent) => a,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'agents') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<AgentsCollection>(
          state,
          transformIntoDocuments([result.agent], transformAgents),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_ERROR': {
      if (action.payload.type === 'agents') {
        const { originalDocument, ref } = action.payload;

        return mergeWebsocketDocuments<AgentsCollection>(
          state,
          transformIntoDocuments([originalDocument], (a: Agent) => a),
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const { payload } = action;

      if (payload.type === 'supportAgent') {
        switch (payload.data.type) {
          case 'available':
          case 'unavailable':
          case 'away':
            return addWebsocketDocuments(
              state,
              [payload.data.agent],
              transformAgents,
              {
                path: {
                  collection: 'agents',
                  authUid: payload.toUserId,
                },
              },
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
