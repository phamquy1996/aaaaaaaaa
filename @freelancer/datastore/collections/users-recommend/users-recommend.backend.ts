import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { UsersRecommendCollection } from './users-recommend.types';

export function usersRecommendBackend(): Backend<UsersRecommendCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'users/0.1/self/recommended',
      isGaf: false,
      params: {
        recommended_user_ids: getQueryParamValue(query, 'recommendedUserId'),
      },
    }),
    push: (_, userRecommend) => ({
      endpoint: 'users/0.1/self/recommended',
      payload: {
        user_to_recommend: userRecommend.recommendedUserId,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
