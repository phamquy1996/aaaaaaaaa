import { CommissionFeeTypeApi } from 'api-typings/common/common';
import { Currency } from '../currencies/currencies.model';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import {
  CommissionFee,
  CommissionFeeRange,
  ProjectBidInfo,
} from './project-bid-info.model';

export const projectBidInfoMixins = {
  generateCommissionFeeRangeObjects,
};

export interface GenerateProjectBidInfoOptions {
  readonly projectId: number;
  readonly minimumFee?: number;
  readonly rate?: number;
  readonly fees?: ReadonlyArray<CommissionFeeRange>;
}

export function generateProjectBidInfoObject({
  projectId,
  minimumFee = 5,
  rate = 0.1,
  fees = generateCommissionFeeRangeObjects({
    currency: generateCurrencyObject(CurrencyCode.USD),
  }),
}: GenerateProjectBidInfoOptions): ProjectBidInfo {
  return {
    id: projectId,
    projectId,
    minimumFee,
    rate,
    minimumSponsorIncrement: 0,
    maximumHighlightCount: 0,
    currentHighlightCount: 0,
    fees,
  };
}

interface GenerateCommissionFeeRangeOptions {
  readonly currency?: Currency;
  readonly rangeLowerBound?: number;
  readonly rangeUpperBound?: number;
  readonly fee?: CommissionFee;
}

// TODO: Proper seed data for different types of projects, currencies and enterprises
function generateCommissionFeeRangeObjects({
  currency,
}: GenerateCommissionFeeRangeOptions): ReadonlyArray<CommissionFeeRange> {
  return [
    {
      rangeLowerBound: 0,
      rangeUpperBound: 200,
      currency,
      fee: {
        feeType: CommissionFeeTypeApi.FLAT,
        amount: 5,
      },
    },
    {
      rangeLowerBound: 200,
      currency,
      fee: {
        feeType: CommissionFeeTypeApi.RATE,
        amount: 0.1,
      },
    },
  ];
}
