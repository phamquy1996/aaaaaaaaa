import { ProjectStatusFromBids } from '@freelancer/project-status';
import { assertNever } from '@freelancer/utils';
import { ManageViewOpenBidsItemAjax } from './manage-view-open-bids.backend-model';
import { ManageViewOpenBid } from './manage-view-open-bids.model';

export function transformManageViewOpenBidsItem(
  manageViewBids: ManageViewOpenBidsItemAjax,
): ManageViewOpenBid {
  return {
    id: manageViewBids.id,
    projectId: manageViewBids.projectId,
    employerId: manageViewBids.employerId,
    recruiter: manageViewBids.recruiter,
    awardTime:
      manageViewBids.awardTime !== undefined
        ? manageViewBids.awardTime * 1000
        : manageViewBids.awardTime,
    bidAmount: manageViewBids.bidAmount,
    bidPlacedDate: manageViewBids.bidPlacedDate * 1000,
    bidStatus: manageViewBids.bidStatus,
    bidStatusOrdering: mapBidStatusOrdering(manageViewBids.bidStatus),
  };
}

/**
 * Map Bid Status to Priority Level from Highest(1) to Lowest (3) for sorting.
 */
export function mapBidStatusOrdering(
  bidStatus:
    | ProjectStatusFromBids.AWAITING_ACCEPTANCE
    | ProjectStatusFromBids.OPEN
    | ProjectStatusFromBids.PENDING,
): number {
  switch (bidStatus) {
    case ProjectStatusFromBids.AWAITING_ACCEPTANCE:
      return 1;
    case ProjectStatusFromBids.OPEN:
      return 2;
    case ProjectStatusFromBids.PENDING:
      return 3;
    default:
      assertNever(bidStatus);
  }
}
