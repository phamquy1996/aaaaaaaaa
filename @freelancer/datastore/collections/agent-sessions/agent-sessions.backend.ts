import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  Ordering,
  RawQuery,
} from '@freelancer/datastore/core';
import {
  AgentSessionOrderByApi,
  AgentSessionStateApi,
  SupportTypeApi,
} from 'api-typings/support/support';
import { SuperuserAgentSessionsCollection } from '../superuser-agent-sessions/superuser-agent-sessions.types';
import { AgentSession } from './agent-sessions.model';
import { AgentSessionsCollection } from './agent-sessions.types';

export function agentSessionsBackend(): Backend<AgentSessionsCollection> {
  return {
    defaultOrder: {
      field: 'createTime',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'support/0.1/agent_sessions/',
      isGaf: false,
      params: getAgentSessionsFetchRequestParameters(ids, query, order),
    }),
    push: undefined,
    set: undefined,
    update: (authUid, delta, originalDocument) => {
      // Assign an agent to an unassigned agent session
      if (
        delta.agentId &&
        originalDocument.state === AgentSessionStateApi.UNASSIGNED
      ) {
        return {
          endpoint: `support/0.1/agent_sessions/${originalDocument.id}/assign`,
          method: 'POST',
          payload: { agent_id: delta.agentId },
        };
      }

      // Resolve unresolved agent session
      if (
        delta.resolvedReason &&
        delta.resolvedReason.description &&
        originalDocument.state !== AgentSessionStateApi.RESOLVED
      ) {
        return {
          endpoint: `support/0.1/agent_sessions/${originalDocument.id}/resolve`,
          method: 'POST',
          payload: { resolve_description: delta.resolvedReason.description },
        };
      }

      // Un-star a starred agent session
      if (delta.starred === false) {
        return {
          endpoint: `support/0.1/agent_sessions/${originalDocument.id}/unstar`,
          method: 'POST',
          payload: {},
        };
      }

      // Star an un-starred agent session
      if (delta.starred === true) {
        return {
          endpoint: `support/0.1/agent_sessions/${originalDocument.id}/star`,
          method: 'POST',
          payload: {},
        };
      }

      throw new Error(`Agent Sessions update not supported for delta ${delta}`);
    },
    remove: undefined,
  };
}
export function getAgentSessionsFetchRequestParameters(
  ids: ReadonlyArray<string> | undefined,
  query: RawQuery<AgentSession> | undefined,
  order:
    | Ordering<AgentSessionsCollection>
    | Ordering<SuperuserAgentSessionsCollection>
    | undefined,
) {
  return {
    // Filters
    agent_sessions: ids,
    sessions: getQueryParamValue(query, 'sessionId'),
    agents: getQueryParamValue(query, 'agentId'),
    agent_session_states: getQueryParamValue(query, 'state'),
    starred: getBooleanQueryParamValue(query, 'starred'),
    latest: getBooleanQueryParamValue(query, 'latest'),
    source_type: getQueryParamValue(query, 'sessionSourceType')[0],
    sources: getQueryParamValue(query, 'sessionSourceId'),
    support_type: getSessionSupportTypeQueryParamValue(query),
    order_by: getOrderByQueryParamValue(order),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
function getBooleanQueryParamValue<T, K extends keyof T>(
  query: RawQuery<T> | undefined,
  name: K,
): boolean | undefined {
  return getQueryParamValue(query, name, param =>
    param.condition === '==' && isBooleanValue(param.value)
      ? param.value
      : undefined,
  )[0];
}

function isBooleanValue(value: any): value is boolean {
  return value.toString() === 'true' || value.toString() === 'false';
}

function getSessionSupportTypeQueryParamValue(
  query: RawQuery<AgentSession> | undefined,
): SupportTypeApi | undefined {
  return getQueryParamValue(query, 'type', param =>
    param.condition === '==' ? param.value : undefined,
  )[0];
}

function getOrderByQueryParamValue(
  orderings:
    | Ordering<AgentSessionsCollection>
    | Ordering<SuperuserAgentSessionsCollection>
    | undefined,
): AgentSessionOrderByApi {
  // Default ordering
  if (!orderings) {
    return AgentSessionOrderByApi.AGENT_SESSION_CREATE_TIME_DSC;
  }

  if (orderings.length > 1) {
    throw Error('Only single field orderings are supported by this collection');
  }

  // Mpa given ordering to API compatible ordering enum
  const order = orderings[0];
  if (
    order.field === 'createTime' &&
    order.direction === OrderByDirection.ASC
  ) {
    return AgentSessionOrderByApi.AGENT_SESSION_CREATE_TIME_ASC;
  }
  if (
    order.field === 'createTime' &&
    order.direction === OrderByDirection.DESC
  ) {
    return AgentSessionOrderByApi.AGENT_SESSION_CREATE_TIME_DSC;
  }
  // TODO: Datastore does not yet support sorting on nullable fields
  // if (
  //   order.field === 'resolvedTime' &&
  //   order.direction === OrderByDirection.ASC
  // ) {
  //   return AgentSessionOrderByApi.AGENT_SESSION_RESOLVED_TIME_ASC;
  // }
  // if (
  //   order.field === 'resolvedTime' &&
  //   order.direction === OrderByDirection.DESC
  // ) {
  //   return AgentSessionOrderByApi.AGENT_SESSION_RESOLVED_TIME_DSC;
  // }
  if (
    order.field === 'sessionCreateTime' &&
    order.direction === OrderByDirection.ASC
  ) {
    return AgentSessionOrderByApi.SESSION_CREATE_TIME_ASC;
  }
  if (
    order.field === 'sessionCreateTime' &&
    order.direction === OrderByDirection.DESC
  ) {
    return AgentSessionOrderByApi.SESSION_CREATE_TIME_DSC;
  }

  throw Error(
    `Unexpected agent session ordering ${order.field}_${order.direction} given`,
  );
}
