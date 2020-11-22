import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { SuperuserProjectViewUsersCollection } from './superuser-project-view-users.types';

export function superuserProjectViewUsersBackend(): Backend<
  SuperuserProjectViewUsersCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    maxBatchSize: 100,
    fetch: (authUid, ids, query, order) => ({
      endpoint: `superuser/0.1/users`,
      params: {
        support_status_details: 'true',
        online_offline_details: 'true',
        location_details: 'true',
        country_details: 'true',
        reputation: 'true',
        avatar: 'true',
        users: ids,
        usernames: getQueryParamValue(query, 'username'),
        status: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
