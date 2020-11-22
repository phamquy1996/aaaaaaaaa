import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ProfileCategoriesCollection } from './profile-categories.types';

export function profileCategoriesBackend(): Backend<
  ProfileCategoriesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      const userIds = getQueryParamValue(query, 'userId');
      if (userIds && userIds.length > 1) {
        throw new Error(
          'Only single `userId` is supported for profileCategories collection',
        );
      }
      if (!userIds || (userIds && userIds.length === 0)) {
        throw new Error('`userId` is required on profileCategories collection');
      }
      return {
        endpoint: 'users/0.1/profile_categories/',
        isGaf: false,
        params: {
          user: userIds[0],
          total_count: true,
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
