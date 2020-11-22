import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { AllProjectsCollection } from './all-projects.types';

export function allProjectsBackend(): Backend<AllProjectsCollection> {
  return {
    defaultOrder: {
      field: 'timeSubmitted',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/projects/all`,
      isGaf: false,
      params: {
        project_statuses: getQueryParamValue(query, 'searchProjectStatus'),
        bid_award_statuses: getQueryParamValue(query, 'bidAwardStatus'),
        bid_complete_statuses: getQueryParamValue(query, 'bidCompleteStatus'),
        unlisted_projects: getQueryParamValue(query, 'unlistedProjects')[0],
        pool_ids: getQueryParamValue(query, 'poolIds')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
