import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { CategoryPageViewUsersCollection } from './category-page-view-users.types';

export function categoryPageViewUsersBackend(): Backend<
  CategoryPageViewUsersCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/users',
      isGaf: false,
      params: {
        avatar: 'true',
        country_details: 'true',
        jobs: 'true',
        users: ids,
        usernames: getQueryParamValue(query, 'username'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
