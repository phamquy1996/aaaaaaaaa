import { ContestFeesGetResult } from './contest-fees.backend-model';
import { ContestFee } from './contest-fees.model';

export function transformContestFees(
  contestFees: ContestFeesGetResult,
): ContestFee {
  return {
    id: contestFees.contestId
      ? `${contestFees.currencyId}_${contestFees.contestId}`
      : `${contestFees.currencyId}`,
    contestId: contestFees.contestId,
    currencyId: contestFees.currencyId,
    featuredPrice: contestFees.featuredPrice,
    topContestPrice: contestFees.topContestPrice,
    highlightPrice: contestFees.highlightPrice,
    sealedPrice: contestFees.sealedPrice,
    ndaPrice: contestFees.ndaPrice,
    privatePrice: contestFees.privatePrice,
    urgentPrice: contestFees.urgentPrice,
    extendedPrice: contestFees.extendedPrice,
  };
}
