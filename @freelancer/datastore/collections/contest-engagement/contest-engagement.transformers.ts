import { ContestEngagementAjax } from './contest-engagement.backend-model';
import { ContestEngagement } from './contest-engagement.model';

export function transformContestEngagement(
  contestEngagement: ContestEngagementAjax,
): ContestEngagement {
  return {
    id: contestEngagement.id,
    totalEngageableEntries: contestEngagement.total_engageable_entries,
    unratedEntries: contestEngagement.unrated_entries_count,
    engagementRatio:
      contestEngagement.total_engageable_entries === 0
        ? 0
        : Math.round(
            ((contestEngagement.total_engageable_entries -
              contestEngagement.unrated_entries_count) /
              contestEngagement.total_engageable_entries) *
              100,
          ),
  };
}
