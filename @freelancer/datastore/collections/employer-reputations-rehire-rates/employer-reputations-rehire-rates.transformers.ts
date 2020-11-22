import { ReputationApi } from 'api-typings/users/users';
import { transformReputationData } from '../reputation/reputation.transformers';
import { EmployerReputation } from './employer-reputations-rehire-rates.model';

export function transformEmployerReputationsRehireRates(
  reputation: ReputationApi,
): EmployerReputation {
  if (!reputation.user_id) {
    throw new ReferenceError('Missing a required reputation field.');
  }

  return {
    projectStats: reputation.project_stats,
    entireHistory: transformReputationData(reputation.entire_history),
    id: reputation.user_id,
    role: reputation.role,
    earningsScore: reputation.earnings_score,
  };
}
