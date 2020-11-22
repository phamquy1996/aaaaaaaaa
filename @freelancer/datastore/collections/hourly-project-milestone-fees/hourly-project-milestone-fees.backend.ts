import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { HourlyProjectMilestoneFeesCollection } from './hourly-project-milestone-fees.types';

export function hourlyProjectMilestoneFeesBackend(): Backend<
  HourlyProjectMilestoneFeesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/getHourlyProjectMilestoneFee.php`,
      isGaf: true,
      params: {
        projectId: getQueryParamValue(query, 'projectId')[0],
        milestoneAmount: getQueryParamValue(query, 'milestoneAmount')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
