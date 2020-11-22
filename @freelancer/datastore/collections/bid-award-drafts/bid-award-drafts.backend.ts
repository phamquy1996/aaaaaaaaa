import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { BidAwardDraftsCollection } from './bid-award-drafts.types';

export function bidAwardDraftsBackend(): Backend<BidAwardDraftsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/bid_award_draft/${getQueryParamValue(
        query,
        'bidId',
      )[0] ?? ''}`,
      params: {
        id: ids ? ids[0] : undefined,
      },
    }),
    push: (authUid, bidAwardDraft) => ({
      endpoint: 'projects/0.1/bid_award_draft',
      asFormData: false,
      payload: {
        bid_id: bidAwardDraft.bidId,
        work_limit: bidAwardDraft.workLimit,
        billing_cycle: bidAwardDraft.billingCycle,
        skip_hourly_contract: bidAwardDraft.skipHourlyContract,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
