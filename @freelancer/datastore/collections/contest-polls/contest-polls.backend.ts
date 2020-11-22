import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ContestPollsCollection } from './contest-polls.types';

export function contestPollsBackend(): Backend<ContestPollsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `contests/0.1/polls/`,
      params: {
        polls: ids,
        contests: getQueryParamValue(query, 'contestId'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
