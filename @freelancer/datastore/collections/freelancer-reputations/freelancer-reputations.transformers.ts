import { ReputationApi } from 'api-typings/users/users';
import { transformReputationData } from '../reputation/reputation.transformers';
import { FreelancerReputation } from './freelancer-reputations.model';

export function transformFreelancerReputations(
  reputation: ReputationApi,
): FreelancerReputation {
  if (!reputation.user_id) {
    throw new ReferenceError('Missing a required reputation field.');
  }

  return {
    entireHistory: transformReputationData(reputation.entire_history),
    id: reputation.user_id,
    role: reputation.role,
    earningsScore: reputation.earnings_score,
  };
}
