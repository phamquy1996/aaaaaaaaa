import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ManageViewHandoversCollection } from './manage-view-handovers.types';

export function manageViewHandoversBackend(): Backend<
  ManageViewHandoversCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'manage/handovers.php',
      isGaf: true,
      params: {
        user_role: getQueryParamValue(query, 'role')[0],
        buyer_signed_contract: booleanToNumber(
          getQueryParamValue(query, 'buyerSignedContract')[0],
        ),
        seller_signed_contract: booleanToNumber(
          getQueryParamValue(query, 'sellerSignedContract')[0],
        ),
        buyer_confirmed: booleanToNumber(
          getQueryParamValue(query, 'buyerConfirmed')[0],
        ),
        seller_confirmed: booleanToNumber(
          getQueryParamValue(query, 'sellerConfirmed')[0],
        ),
        query:
          query && query.searchQueryParams && query.searchQueryParams.query,
        offset:
          query && query.searchQueryParams && query.searchQueryParams.offset,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}

function booleanToNumber(param?: boolean): number | undefined {
  if (param !== undefined) {
    return param ? 1 : 0;
  }
  return param;
}
