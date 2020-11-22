import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { RecommendedUsernamesCollection } from './recommended-usernames.types';

export function recommendedUsernamesBackend(): Backend<
  RecommendedUsernamesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/users/check?recommend_name=true',
      method: 'POST',
      payload: {
        user: {
          email: getQueryParamValue(query, 'email')[0],
        },
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
