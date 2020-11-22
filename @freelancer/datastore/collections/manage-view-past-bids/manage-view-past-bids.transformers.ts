import { ManageViewPastBidsItemAjax } from './manage-view-past-bids.backend-model';
import { ManageViewPastBid } from './manage-view-past-bids.model';

export function transformManageViewPastBidsItem(
  manageViewBids: ManageViewPastBidsItemAjax,
): ManageViewPastBid {
  return {
    id: manageViewBids.id,
    projectId: manageViewBids.projectId,
    employerId: manageViewBids.employerId,
    recruiter: manageViewBids.recruiter,
    bidStatus: manageViewBids.bidStatus,
    projectDeleted: manageViewBids.projectDeleted,
    milestoneAmount: manageViewBids.milestoneAmount,
    milestoneCount: manageViewBids.milestoneCount,
    timeAccepted: manageViewBids.timeAccepted * 1000,
    bidAmount: manageViewBids.bidAmount,
    projectName: manageViewBids.projectName,
    projectTimeSubmitted: manageViewBids.projectTimeSubmitted * 1000,
  };
}
