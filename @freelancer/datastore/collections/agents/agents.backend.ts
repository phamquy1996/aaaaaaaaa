import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { AgentSetStateRequestApi } from 'api-typings/support/support';
import { AgentsCollection } from './agents.types';

export function agentsBackend(): Backend<AgentsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'support/0.1/agents/',
      params: {
        // Filters
        agents: ids,
        users: getQueryParamValue(query, 'userId'),
        support_types: getQueryParamValue(query, 'type'),
        agent_states: getQueryParamValue(query, 'state'),
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, partial, original) => ({
      endpoint: `support/0.1/agents/${original.id}/state`,
      method: 'POST',
      payload: {
        state: partial.state,
      } as AgentSetStateRequestApi,
    }),
    remove: undefined,
  };
}
