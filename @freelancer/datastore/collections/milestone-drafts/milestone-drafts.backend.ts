import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { MilestoneDraftsCollection } from './milestone-drafts.types';

export function milestoneDraftsBackend(): Backend<MilestoneDraftsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/0.1/milestone_drafts',
      params: {
        project_id: getQueryParamValue(query, 'projectId')[0],
        milestone_drafts: ids,
      },
    }),
    push: (_, milestoneDraft) => ({
      endpoint: 'projects/0.1/milestone_drafts',
      payload: {
        amount: milestoneDraft.amount,
        bidder_id: milestoneDraft.bidderId,
        bid_id: milestoneDraft.bidId,
        currency_id: milestoneDraft.currencyId,
        description: milestoneDraft.description,
        milestone_request_id: milestoneDraft.milestoneRequestId,
        project_id: milestoneDraft.projectId,
        project_owner_id: milestoneDraft.projectOwnerId,
        project_invoice_id: milestoneDraft.invoiceId,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
