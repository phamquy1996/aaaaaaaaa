import { toNumber } from '@freelancer/utils';
import { UserBidLimitGetResultAjax } from './user-bid-limit.backend-model';
import { UserBidLimit } from './user-bid-limit.model';

export function transformUserBidLimit(
  userBidLimit: UserBidLimitGetResultAjax,
  authUserId: string,
): UserBidLimit {
  const bidsLastRefilledTime = toNumber(userBidLimit.bidsLastRefilled) * 1000;
  const bidRefreshTimeMilliseconds = userBidLimit.bidRefreshTime * 1000;
  const nextBidRefreshTime = bidsLastRefilledTime + bidRefreshTimeMilliseconds;

  return {
    id: authUserId,
    bidsRemaining: userBidLimit.bidsRemaining,
    bidLimit: userBidLimit.bidLimit,
    bidsLastRefilled: bidsLastRefilledTime,
    bidRefreshTime: bidRefreshTimeMilliseconds,
    bidRefreshRate: Math.round(userBidLimit.bidRefreshRate * 10) / 10,
    nextBidRefreshTime,
    unlimitedBids: userBidLimit.unlimitedBids,
  };
}
