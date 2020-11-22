import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ProjectStatsCollection } from './project-stats.types';

export function projectStatsBackend(): Backend<ProjectStatsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      const fromTime = getQueryParamValue(query, 'fromTime')[0];
      const toTime = getQueryParamValue(query, 'toTime')[0];
      return {
        endpoint: 'marketplace_stats/0.1/project-stats',
        isGaf: false,
        params: {
          enterprise: getQueryParamValue(query, 'enterprise')[0],
          project_status: getQueryParamValue(query, 'projectStatus')[0],
          from_time: fromTime ? fromTime / 1000 : undefined,
          to_time: toTime ? toTime / 1000 : undefined,
          fixed_projects_stats: true,
          hourly_projects_stats: true,
          project_count_stats: true,
          project_value_stats: true,
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
