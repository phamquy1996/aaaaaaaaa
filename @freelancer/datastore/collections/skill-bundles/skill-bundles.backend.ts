import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { SkillBundlesCollection } from './skill-bundles.types';

export function skillBundlesBackend(): Backend<SkillBundlesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },

    fetch: (authUid, ids, query) => ({
      endpoint: '/projects/0.1/job_bundles',
      params: {
        categories: getQueryParamValue(query, 'category'),
        job_bundles: getQueryParamValue(query, 'subcategory'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
