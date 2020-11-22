import { ReputationApi, ReputationDataApi } from 'api-typings/users/users';
import { Reputation, ReputationData } from './reputation.model';

export function transformReputation(reputation: ReputationApi): Reputation {
  return {
    entireHistory: transformReputationData(reputation.entire_history),
    last3Months: transformReputationData(reputation.last3months),
    last12Months: transformReputationData(reputation.last12months),
    userId: reputation.user_id,
    role: reputation.role,
    earningsScore: reputation.earnings_score,
    jobHistory: reputation.job_history,
    projectStats: reputation.project_stats,
  };
}

export function transformReputationData(
  repData: ReputationDataApi,
): ReputationData {
  return {
    overall: repData.overall,
    onBudget: repData.on_budget,
    // tslint:disable-next-line:validate-millisecond-timestamps
    onTime: repData.on_time,
    positive: repData.positive,
    all: repData.all,
    reviews: repData.reviews,
    incompleteReviews: repData.incomplete_reviews,
    complete: repData.complete,
    incomplete: repData.incomplete,
    earnings: repData.earnings,
    completionRate: Math.round(repData.completion_rate * 10 ** 2),
    rehireRate: repData.rehire_rate,
    categoryRatings: repData.category_ratings,
  };
}
