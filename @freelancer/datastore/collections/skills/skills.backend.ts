import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { SkillsCollection } from './skills.types';

export function skillsBackend(): Backend<SkillsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/0.1/jobs/',
      params: {
        active_project_count_details: true,
        job_names: getQueryParamValue(query, 'name'),
        jobs: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
