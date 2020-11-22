import { toNumber } from '@freelancer/utils';
import { ContestsSelfInsightsGetResultApi } from 'api-typings/contests/contests';
import { ContestsSelfInsights } from './contests-self-insights.model';

export function transformContestsSelfInsights(
  contestsSelfInsights: ContestsSelfInsightsGetResultApi,
  authId: string,
): ContestsSelfInsights {
  if (
    contestsSelfInsights.pending_prizes_amount === undefined ||
    contestsSelfInsights.released_current_week_amount === undefined ||
    contestsSelfInsights.active_contests_count === undefined
  ) {
    throw new ReferenceError('Missing contests insights field.');
  }

  return {
    id: toNumber(authId),
    pendingPrizesAmount: contestsSelfInsights.pending_prizes_amount,
    releasedCurrentWeekAmount:
      contestsSelfInsights.released_current_week_amount,
    activeContestsCount: contestsSelfInsights.active_contests_count,
  };
}
