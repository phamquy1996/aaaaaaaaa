import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { ContestHandover } from './contest-handovers.model';
import { ContestHandoversCollection } from './contest-handovers.types';

export function contestHandoversBackend(): Backend<ContestHandoversCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/0.1/handovers/',
      isGaf: false,
      params: {
        users: getUsers(query),
        user_role:
          getQueryParamValue(query, 'buyerId').length > 0 ? 'SELLER' : 'BUYER',
        entry_ids: getQueryParamValue(query, 'entryId'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
function getUsers(
  query: RawQuery<ContestHandover> | undefined,
): ReadonlyArray<number> | undefined {
  if (!query) {
    return undefined;
  }
  const sellerIds = getQueryParamValue(query, 'sellerId');
  return sellerIds.length > 0
    ? sellerIds
    : getQueryParamValue(query, 'buyerId');
}
