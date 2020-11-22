import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { TeamMembersCollection } from './team-members.types';

// NOTE: We can only get team members with the datastore list function,
// since we require a query object to set the teamId.

export function teamMembersBackend(): Backend<TeamMembersCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `users/0.1/teams/${
        getQueryParamValue(query, 'teamId')[0]
      }/members/`,
      isGaf: false,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
