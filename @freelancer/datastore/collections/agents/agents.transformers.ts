import { AgentApi } from 'api-typings/support/support';
import { Agent } from './agents.model';

export function transformAgents(agent: AgentApi): Agent {
  return {
    id: agent.id,
    userId: agent.user_id,
    owner: agent.owner || undefined,
    type: agent.support_type,
    createTime: agent.create_time * 1000, // Convert to milliseconds
    state: agent.state,
  };
}
