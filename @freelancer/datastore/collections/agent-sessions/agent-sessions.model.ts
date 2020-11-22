import {
  AgentSessionStateApi,
  ResolvedReasonApi,
  SourceTypeApi,
  SupportTypeApi,
} from 'api-typings/support/support';

/**
 * A support session for support queue agents.
 * Primarily used in Messaging for contextual details on SUPPORT_SESSION threads.
 */
export interface AgentSession {
  readonly id: number;
  readonly type: SupportTypeApi;
  readonly state: AgentSessionStateApi;
  readonly latest: boolean;
  readonly createTime: number;
  readonly resolvedTime?: number;
  readonly resolvedReason?: ResolvedReasonApi;
  readonly agentId?: number;
  readonly starred?: boolean;

  readonly sessionId: number;
  readonly sessionType: SupportTypeApi;
  readonly sessionOwnerId: number;

  readonly sessionCreateTime: number;

  readonly sessionSourceType: SourceTypeApi;
  readonly sessionSourceId: number;
}

export enum QueueEventType {
  ASSIGN = 'assign',
  REASSIGN = 'reassign',
  RESOLVE = 'resolve',
  AVAILABILITY = 'availability',
  ENQUEUE = 'enqueue',
  NO_AGENTS_AVAILABLE = 'no_agents_available',
}
