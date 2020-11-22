import { EnterpriseApi } from 'api-typings/common/common';
import {
  ProjectStatsGetResultApi,
  ProjectStatsStatusFilterApi,
} from 'api-typings/projects/projects';
import { ProjectStatsGetResult } from './project-stats.model';

export interface ProjectStatsQueryExtras {
  readonly fromTime?: number;
  readonly toTime?: number;
  readonly enterprise: EnterpriseApi;
  readonly projectStatus?: ProjectStatsStatusFilterApi;
}

export function transformProjectStats(
  stats: ProjectStatsGetResultApi,
  queryExtras: ProjectStatsQueryExtras,
): ProjectStatsGetResult {
  const fromTime = queryExtras.fromTime
    ? queryExtras.fromTime * 1000
    : undefined;
  const toTime = queryExtras.toTime ? queryExtras.toTime * 1000 : undefined;
  return {
    id: `id-${queryExtras.enterprise}-${queryExtras.projectStatus}-${fromTime}-${toTime}`,
    enterprise: queryExtras.enterprise,
    projectStatus: queryExtras.projectStatus,
    fromTime,
    toTime,
    fixed: stats.fixed_projects
      ? {
          totalPotentialProjectValue:
            stats.fixed_projects.total_potential_project_value,
          totalActualProjectValue:
            stats.fixed_projects.total_actual_project_value,
          averageProjectValue: stats.fixed_projects.average_project_value,
          projectCount: stats.fixed_projects.project_count,
        }
      : undefined,
    hourly: stats.hourly_projects
      ? {
          totalPotentialProjectValue:
            stats.hourly_projects.total_potential_project_value,
          totalActualProjectValue:
            stats.hourly_projects.total_actual_project_value,
          averageProjectValue: stats.hourly_projects.average_project_value,
          projectCount: stats.hourly_projects.project_count,
        }
      : undefined,
  };
}
