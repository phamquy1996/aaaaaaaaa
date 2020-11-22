import { MilestoneDraftApi } from 'api-typings/projects/projects';
import { Bid } from '../bids/bids.model';
import { MilestoneRequest } from '../milestone-requests/milestone-requests.model';
import { Project } from '../projects/projects.model';
import { MilestoneDraft } from './milestone-drafts.model';

export function transformMilestoneDrafts(
  milestoneDrafts: MilestoneDraftApi,
): MilestoneDraft {
  return {
    amount: milestoneDrafts.amount,
    bidderId: milestoneDrafts.bidder_id,
    bidId: milestoneDrafts.bid_id,
    currencyId: milestoneDrafts.currency_id,
    description: milestoneDrafts.description,
    id: milestoneDrafts.id,
    milestoneRequestId: milestoneDrafts.milestone_request_id,
    projectId: milestoneDrafts.project_id,
    projectOwnerId: milestoneDrafts.project_owner_id,
    timeCreated: milestoneDrafts.time_created * 1000,
    transactionId: milestoneDrafts.transaction_id,
    invoiceId: milestoneDrafts.project_invoice_id,
  };
}

export function transformMilestoneDraftsFromRequest(
  milestoneRequest: MilestoneRequest,
  project: Project,
  bid: Bid,
): MilestoneDraft {
  return {
    amount: milestoneRequest.amount,
    bidderId: milestoneRequest.bidderId || bid.bidderId,
    bidId: milestoneRequest.bidId || bid.id,
    currencyId:
      (milestoneRequest.currency && milestoneRequest.currency.id) ||
      project.currency.id,
    description: milestoneRequest.description || ``,
    id: 0,
    milestoneRequestId: milestoneRequest.id,
    projectId: milestoneRequest.projectId,
    projectOwnerId: milestoneRequest.projectOwnerId || project.ownerId,
    timeCreated: Date.now(),
  };
}
