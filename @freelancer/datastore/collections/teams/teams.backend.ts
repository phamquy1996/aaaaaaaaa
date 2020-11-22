import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { TeamsCollection } from './teams.types';

export function teamsBackend(): Backend<TeamsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/teams',
      isGaf: false,
      params: {
        // teams: ids || [], // This is not supported by the backend yet, see T62964
        owners: getQueryParamValue(query, 'ownerUserId'),
        members: getQueryParamValue(query, 'members')[0],
      },
    }),
    // Add push, update, set, delete below when needed (teams management page). Note that you will need
    // to add the corresponding payload models to `backend.model.ts`
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
