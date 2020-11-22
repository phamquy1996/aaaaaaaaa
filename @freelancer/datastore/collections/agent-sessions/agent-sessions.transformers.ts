import {
  AgentSessionApi,
  AgentSessionStateApi,
  ResolvedReasonApi,
  SessionApi,
  SourceTypeApi,
  SupportTypeApi,
} from 'api-typings/support/support';
import { AgentSession } from './agent-sessions.model';

export function transformAgentSessions(
  agentSession: AgentSessionApi,
  sessions: { readonly [k: number]: SessionApi | undefined },
): AgentSession {
  // Must check this since it's not guaranteed that the sessions map will
  // have a matching session from the back-end.
  const session = sessions[agentSession.session_id];
  if (session === undefined) {
    throw new Error('Agent sessions should always have an associated session.');
  }

  return {
    ...transformBackendAgentSession(agentSession),
    ...transformBackendSession(session),
  };
}

/**
 * Transform and merge in a backend AgentSessionApi object with an existing
 * AgentSession object.
 *
 * This method is required since not all support APIs return the backend Session
 * with the backend AgentSession which is required by the
 * `transformAgentSessions`.
 */
export function transformAgentSession(
  backendAgentSession: AgentSessionApi,
  originalAgentSession: AgentSession,
): AgentSession {
  return {
    ...originalAgentSession,
    ...transformBackendAgentSession(backendAgentSession),
  };
}

/**
 * The `agentSession` collection's definition requires that we
 * flatten `AgentSessionApi` with `SessionApi` so that we simplify querying
 * in the front-end.
 *
 * The additional models below are required so that we can split up the
 * transformers for each backend object expected since not all support APIs
 * return both the back-end Session with the backend AgentSession, so we
 * end up with the following models;
 *  - `PartialSession`
 *  - `PartialAgentSession`
 * Together these can be union'd to give the expected `agentSession` collection
 * type `AgentSession`.
 */
interface PartialSession {
  readonly sessionId: number;
  readonly sessionType: SupportTypeApi;
  readonly sessionOwnerId: number;
  readonly sessionCreateTime: number;

  readonly sessionSourceType: SourceTypeApi;
  readonly sessionSourceId: number;
}
interface PartialAgentSession {
  readonly id: number;
  readonly type: SupportTypeApi;
  readonly state: AgentSessionStateApi;
  readonly latest: boolean;
  readonly createTime: number;
  readonly resolvedTime?: number;
  readonly resolvedReason?: ResolvedReasonApi;
  readonly agentId?: number;
  readonly starred?: boolean;
}
function transformBackendSession(session: SessionApi): PartialSession {
  return {
    sessionId: session.id,
    sessionType: session.support_type,
    sessionOwnerId: session.user_id,
    sessionCreateTime: session.create_time * 1000, // Convert to milliseconds
    sessionSourceType: session.source.type,
    sessionSourceId: session.source.id,
  };
}
function transformBackendAgentSession(
  agentSession: AgentSessionApi,
): PartialAgentSession {
  return {
    id: agentSession.id,
    type: agentSession.support_type,
    state: agentSession.state,
    latest: agentSession.is_latest,
    createTime: agentSession.create_time * 1000, // Convert to milliseconds
    resolvedTime: agentSession.resolved_time
      ? agentSession.resolved_time * 1000 // Convert to milliseconds
      : undefined,
    resolvedReason: agentSession.resolved_reason || undefined,
    agentId: agentSession.agent_id || undefined,
    starred: agentSession.is_starred ? agentSession.is_starred : undefined,
  };
}
