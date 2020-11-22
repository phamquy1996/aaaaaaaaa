import { CommissionFeeApi } from 'api-typings/common/common';
import {
  BidInfoApi,
  CommissionFeeRangeApi,
} from 'api-typings/projects/projects';
import { transformBid } from '../bids/bids.transformers';
import { transformCurrency } from '../currencies/currencies.transformers';
import {
  CommissionFee,
  CommissionFeeRange,
  ProjectBidInfo,
} from './project-bid-info.model';

export function transformProjectBidInfo(bidInfo: BidInfoApi): ProjectBidInfo {
  if (bidInfo.fees === undefined) {
    throw new Error('New fee structure is undefined.');
  }
  return {
    id: bidInfo.project_id,
    projectId: bidInfo.project_id,
    minimumFee: bidInfo.minimum_fee || 0,
    rate: bidInfo.rate || 0.1,
    highlightCost: bidInfo.highlight_cost,
    highlightCurrency: bidInfo.highlight_currency
      ? transformCurrency(bidInfo.highlight_currency)
      : undefined,
    highestSponsorAmount: bidInfo.highest_sponsor_amount,
    minimumSponsorIncrement: bidInfo.minimum_sponsor_increment || 10,
    maximumHighlightCount: bidInfo.maximum_highlight_count || 5,
    currentHighlightCount: bidInfo.current_highlight_count || 0,
    defaultBid: bidInfo.default_bid
      ? transformBid(bidInfo.default_bid)
      : undefined,
    minimumBid: bidInfo.minimum_bid,
    maximumBid: bidInfo.maximum_bid,
    range: bidInfo.range,
    fees: bidInfo.fees.map(transformCommissionFeeRange),
  };
}

export function transformCommissionFeeRange(
  commissionFeeRange: CommissionFeeRangeApi,
): CommissionFeeRange {
  if (commissionFeeRange.range_lower_bound === undefined) {
    throw new Error('Commission fee lower range is undefined.');
  }
  return {
    rangeLowerBound: commissionFeeRange.range_lower_bound,
    rangeUpperBound: commissionFeeRange.range_upper_bound,
    currency: commissionFeeRange.currency
      ? transformCurrency(commissionFeeRange.currency)
      : undefined,
    fee: transformCommissionFee(commissionFeeRange.fee),
  };
}

export function transformCommissionFee(
  commissionFee: CommissionFeeApi,
): CommissionFee {
  return {
    feeType: commissionFee.fee_type,
    amount: commissionFee.amount,
  };
}
