import { generateFreeMembershipPackage } from '../project-view-users/project-view-users.seed';
import { UserBidLimit } from './user-bid-limit.model';

export const userBidLimitMixins = {
  noBidsRemaining,
};

export interface GenerateUserBidLimitOptions {
  readonly userId: number;
  readonly bidsRemaining?: number;
  readonly bidLimit?: number;
  readonly bidRefreshRate?: number;
  readonly unlimitedBids?: boolean;
}

const freeMembership = generateFreeMembershipPackage();

export function generateUserBidLimitObject({
  userId,
  bidsRemaining = freeMembership.bidLimit || 20,
  bidLimit = freeMembership.bidLimit || 20,
  bidRefreshRate = freeMembership.bidRefreshRate || 1,
  unlimitedBids = false,
}: GenerateUserBidLimitOptions): UserBidLimit {
  const now = Date.now();

  return {
    id: userId.toString(),
    bidsRemaining,
    bidLimit,
    bidsLastRefilled: now,
    bidRefreshTime: 60 * 60 * 1000,
    bidRefreshRate,
    nextBidRefreshTime: now + 60 * 60 * 1000, // one hour from now
    unlimitedBids,
  };
}

function noBidsRemaining(): Pick<GenerateUserBidLimitOptions, 'bidsRemaining'> {
  return {
    bidsRemaining: 0,
  };
}
