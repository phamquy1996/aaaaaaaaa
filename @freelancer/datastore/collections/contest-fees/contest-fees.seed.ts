import { generateId } from '@freelancer/datastore/testing';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { ContestFee } from './contest-fees.model';

export interface GenerateContestFeesOptions {
  readonly currencyCode?: CurrencyCode;
  readonly contestId?: number;
}

// TODO: Other currencies than USD
export function generateContestFeesObject({
  currencyCode = CurrencyCode.USD,
  contestId = generateId(),
}: GenerateContestFeesOptions): ContestFee {
  return {
    id: `${contestId}`,
    contestId,
    currencyId: generateCurrencyObject(currencyCode).id,
    featuredPrice: 33,
    topContestPrice: 33,
    highlightPrice: 16.5,
    sealedPrice: 33,
    ndaPrice: 22,
    privatePrice: 27.500000000000004,
    urgentPrice: 38.5,
    extendedPrice: {
      three_days: 29.68,
      five_days: 39.899999999999999,
      seven_days: 60.350000000000001,
      fourteen_days: 79.799999999999997,
      twenty_one_days: 100.25,
    },
  };
}
