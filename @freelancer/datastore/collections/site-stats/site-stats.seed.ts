import { SiteStats } from './site-stats.model';

export interface GenerateSiteStatsOptions {
  readonly userId: number;
}

export function generateSiteStatsObject({
  userId,
}: GenerateSiteStatsOptions): SiteStats {
  return {
    id: userId.toString(),
    projectCount: 4864009,
    projectCountPerDay: 3021,
    userCount: 30874142,
    userCountPerDay: 1780,
  };
}
