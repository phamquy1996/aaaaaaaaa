import { BidApi } from 'api-typings/projects/projects';
import { BidBuyerProjectFee } from './bid-buyer-project-fees.model';

export function transformBidBuyerProjectFee(bid: BidApi): BidBuyerProjectFee {
  if (!bid.buyer_project_fee) {
    throw new ReferenceError(`Bid missing buyer_project_fee.`);
  }
  if (!bid.submitdate) {
    throw new ReferenceError(`Bid missing submitdate.`);
  }

  return {
    id: bid.id,
    amount: bid.buyer_project_fee.amount,
    isTaxed: bid.buyer_project_fee.is_taxed,
    rate: bid.buyer_project_fee.rate,
    submitDate: bid.submitdate * 1000,
  };
}
