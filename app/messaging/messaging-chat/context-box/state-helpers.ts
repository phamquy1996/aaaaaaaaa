import {
  Bid,
  HourlyContract,
  Milestone,
  MilestoneRequest,
} from '@freelancer/datastore/collections';

export const isProjectOwner = (bid: Bid, userId: number) =>
  userId === bid.projectOwnerId;

export const isAwarded = (bid: Bid) => bid.awardStatus === 'awarded';

export const isRevoked = (bid: Bid) => bid.awardStatus === 'revoked';

export const isPending = (bid: Bid) => bid.awardStatus === 'pending';

export const canBeAwarded = (bid: Bid, userId: number) =>
  !isAwarded(bid) && !isPending(bid) && isProjectOwner(bid, userId);

export const canBeAccepted = (bid: Bid, userId: number) =>
  !isAwarded(bid) &&
  !isRevoked(bid) &&
  isPending(bid) &&
  !isProjectOwner(bid, userId);

export const canRequestMilestone = (bid: Bid, userId: number) =>
  isAwarded(bid) && !isProjectOwner(bid, userId);

export const canCreateMilestone = (bid: Bid, userId: number) =>
  isAwarded(bid) &&
  bid.paidStatus !== 'fully_paid' &&
  isProjectOwner(bid, userId);

export const isHourlyBillingEnabled = (hourlyContract: HourlyContract) =>
  hourlyContract.invalidTime === undefined &&
  hourlyContract.timeTrackingStopped === undefined &&
  hourlyContract.invoicePaymentMethod === 'automatic';

export function getBid(
  authUid: number,
  threadMemberIds: ReadonlyArray<number>,
  bids: ReadonlyArray<Bid>,
): Bid | undefined {
  return bids.filter(
    bid =>
      bid.bidderId === authUid ||
      (threadMemberIds.length < 3 && threadMemberIds.includes(bid.bidderId)),
  )[0];
}

export function getFilteredMilestones(
  authUid: number,
  threadMemberIds: ReadonlyArray<number>,
  milestones: ReadonlyArray<Milestone>,
): ReadonlyArray<Milestone> {
  return milestones.filter(
    m =>
      m.bidderId === authUid ||
      (threadMemberIds.length < 3 &&
        threadMemberIds.includes(m.bidderId || -1)),
  );
}

export function getFilteredMilestoneRequests(
  authUid: number,
  threadMemberIds: ReadonlyArray<number>,
  milestoneRequests: ReadonlyArray<MilestoneRequest>,
): ReadonlyArray<MilestoneRequest> {
  return milestoneRequests.filter(
    mr =>
      mr.bidderId === authUid ||
      (threadMemberIds.length < 3 &&
        threadMemberIds.includes(mr.bidderId || -1)),
  );
}
