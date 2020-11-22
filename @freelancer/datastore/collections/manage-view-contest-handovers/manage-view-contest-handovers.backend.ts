import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ManageViewContestHandoversCollection } from './manage-view-contest-handovers.types';

export function manageViewContestHandoversBackend(): Backend<
  ManageViewContestHandoversCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/0.1/handovers/',
      isGaf: false,
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

        // projections
        user_avatar: 'true',
        user_details: 'true',
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
