import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ContestInterestedFreelancersCollection } from './contest-interested-freelancers.types';

export function contestInterestedFreelancersBackend(): Backend<
  ContestInterestedFreelancersCollection
> {
  return {
    defaultOrder: {
      field: 'createDate',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/getInterestedFreelancers.php',
      isGaf: true,
      params: {
        contest_id: getQueryParamValue(query, 'contestId')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
