import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { getAgentSessionsFetchRequestParameters } from '../agent-sessions/agent-sessions.backend';
import { SuperuserAgentSessionsCollection } from './superuser-agent-sessions.types';

export function agentSessionsBackend(): Backend<
  SuperuserAgentSessionsCollection
> {
  return {
    defaultOrder: {
      field: 'createTime',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'superuser/0.1/agent_sessions/',
      isGaf: false,
      params: getAgentSessionsFetchRequestParameters(ids, query, order),
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
