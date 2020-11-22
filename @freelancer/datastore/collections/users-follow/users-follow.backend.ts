import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { UsersFollowCollection } from './users-follow.types';

export function usersFollowBackend(): Backend<UsersFollowCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'users/0.1/self/following',
      params: {
        followed_users_id: getQueryParamValue(query, 'followedUserId'),
      },
    }),
    push: (_, userFollow) => ({
      endpoint: 'users/0.1/self/following',
      payload: {
        user_to_follow: userFollow.followedUserId,
      },
    }),
    set: undefined,
    update: undefined,
    remove: (_, userId) => ({
      method: 'DELETE',
      endpoint: `users/0.1/self/following/${userId}`,
      payload: {},
    }),
  };
}
