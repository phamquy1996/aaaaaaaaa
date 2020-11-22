import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { JobClassifierCollection } from './job-classifier.types';

export function jobClassifierBackend(): Backend<JobClassifierCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'jobs/classify.php',
      isGaf: true,
      params: {
        jobs: getQueryParamValue(query, 'skillIds')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
