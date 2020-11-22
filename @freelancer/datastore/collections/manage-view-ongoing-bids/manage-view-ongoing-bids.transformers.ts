import { ManageViewOngoingBidsItemAjax } from './manage-view-ongoing-bids.backend-model';
import { ManageViewOngoingBid } from './manage-view-ongoing-bids.model';

export function transformManageViewOngoingBidsItem(
  manageViewBids: ManageViewOngoingBidsItemAjax,
): ManageViewOngoingBid {
  return {
    id: manageViewBids.id,
    projectId: manageViewBids.projectId,
    employerId: manageViewBids.employerId,
    recruiter: manageViewBids.recruiter,
    milestoneCount: manageViewBids.milestoneCount,
    milestoneAmount: manageViewBids.milestoneAmount,
    deadline: manageViewBids.deadline * 1000,
    bidAmount: manageViewBids.bidAmount,
  };
}
