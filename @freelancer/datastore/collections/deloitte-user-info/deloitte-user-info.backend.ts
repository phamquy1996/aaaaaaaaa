import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { DeloitteUserInfoCollection } from './deloitte-user-info.types';

export function deloitteUserInfoGetResultAjax(): Backend<
  DeloitteUserInfoCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'enterprise/deloitte_user_info.php',
      isGaf: true,
      params: {
        user_ids: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
