import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { SuperuserBidsCollection } from './superuser-bids.types';

export function superuserBidsBackend(): Backend<SuperuserBidsCollection> {
  return {
    defaultOrder: {
      field: 'submitDate',
      direction: OrderByDirection.DESC,
    }, // FIXME: T50040 This uses `first_submitdate` which is not returned
    fetch: (authUid, ids, query, order) => ({
      endpoint: `superuser/0.1/bids`,
      params: {
        bids: ids,
        bidders: getQueryParamValue(query, 'bidderId'),
        projects: getQueryParamValue(query, 'projectId'),
        frontend_bid_statuses: getQueryParamValue(query, 'frontendBidStatus'),
        award_statuses: getQueryParamValue(query, 'awardStatus'),
        complete_statuses: getQueryParamValue(query, 'completeStatus'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
