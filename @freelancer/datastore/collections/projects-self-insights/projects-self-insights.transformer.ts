import { toNumber } from '@freelancer/utils';
import { ProjectsSelfInsightsGetResultApi } from 'api-typings/projects/projects';
import { ProjectsSelfInsights } from './projects-self-insights.model';

export function transformProjectsSelfInsights(
  projectsSelfInsights: ProjectsSelfInsightsGetResultApi,
  authId: string,
): ProjectsSelfInsights {
  if (
    projectsSelfInsights.in_progress_amount === undefined ||
    projectsSelfInsights.released_current_week_amount === undefined ||
    projectsSelfInsights.ongoing_projects_count === undefined
  ) {
    throw new ReferenceError('Missing projects insights field.');
  }

  return {
    id: toNumber(authId),
    inProgressAmount: projectsSelfInsights.in_progress_amount,
    releasedCurrentWeekAmount:
      projectsSelfInsights.released_current_week_amount,
    ongoingProjectsCount: projectsSelfInsights.ongoing_projects_count,
  };
}
