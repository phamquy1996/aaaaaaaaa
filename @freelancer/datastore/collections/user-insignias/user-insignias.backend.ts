import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { UserInsigniasCollection } from './user-insignias.types';

export function userInsigniasBackend(): Backend<UserInsigniasCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'user/getUserInsignias.php',
      isGaf: true,
      params: {
        userIds: getQueryParamValue(query, 'userId') || [],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
