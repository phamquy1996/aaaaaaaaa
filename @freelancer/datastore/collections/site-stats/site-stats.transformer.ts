import { SiteStatsResultAjax } from './site-stats.backend-model';
import { SiteStats } from './site-stats.model';

export function transformSiteStats(
  siteStats: SiteStatsResultAjax,
  authUid: string,
): SiteStats {
  return {
    id: authUid,
    projectCount: siteStats.project_count,
    projectCountPerDay: siteStats.project_count_per_day,
    userCount: siteStats.user_count,
    userCountPerDay: siteStats.user_count_per_day,
  };
}
