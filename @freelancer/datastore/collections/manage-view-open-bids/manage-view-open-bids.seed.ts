import { randomiseList } from '@freelancer/datastore/testing';
import { ProjectStatusFromBids } from '@freelancer/project-status';
import { Bid } from '../bids';
import { ManageViewOpenBid } from './manage-view-open-bids.model';
import { mapBidStatusOrdering } from './manage-view-open-bids.transformers';

export interface GenerateManageViewOpenBidsOptions {
  readonly bids: ReadonlyArray<Bid>;
}

export function generateManageViewOpenBidsObjects({
  bids = [],
}: GenerateManageViewOpenBidsOptions): ReadonlyArray<ManageViewOpenBid> {
  return bids.map(bid => {
    if (!bid.projectOwnerId) {
      throw new Error('Missing projectOwnerId');
    }

    const bidStatus = pickOne<
      | ProjectStatusFromBids.AWAITING_ACCEPTANCE
      | ProjectStatusFromBids.OPEN
      | ProjectStatusFromBids.PENDING
    >(
      [
        ProjectStatusFromBids.AWAITING_ACCEPTANCE,
        ProjectStatusFromBids.OPEN,
        ProjectStatusFromBids.PENDING,
      ],
      bid.id.toString(),
    );

    return {
      id: bid.id,
      projectId: bid.projectId,
      employerId: bid.projectOwnerId,
      bidAmount: bid.amount,
      bidPlacedDate: bid.submitDate,
      recruiter: false,
      awardTime: bid.timeAwarded,
      bidStatus,
      bidStatusOrdering: mapBidStatusOrdering(bidStatus),
    };
  });
}

function pickOne<T>(list: ReadonlyArray<T>, seed: string): T {
  return randomiseList(list, seed)[0];
}
