import { ProjectUpgradeFeeTaxTypeApi } from 'api-typings/projects/projects';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { BidUpgradeFees } from './bid-upgrade-fees.model';

export interface GenerateBidUpgradeFeesOptions {
  readonly currencyCode: CurrencyCode;
  readonly highlightPrice?: number;
  readonly sealedPrice?: number;
  readonly freeHighlight?: boolean;
  readonly taxType?: ProjectUpgradeFeeTaxTypeApi;
}

// TODO: Generate BidUpgradeFees objects for different countries
export function generateBidUpgradeFeesObject({
  currencyCode,
  highlightPrice = 1.1,
  sealedPrice = 1.1,
  freeHighlight = false,
  taxType,
}: GenerateBidUpgradeFeesOptions): BidUpgradeFees {
  const currency = generateCurrencyObject(currencyCode);

  return {
    id: currency.id,
    currency,
    highlightPrice,
    sealedPrice,
    freeHighlight,
    taxType,
  };
}
