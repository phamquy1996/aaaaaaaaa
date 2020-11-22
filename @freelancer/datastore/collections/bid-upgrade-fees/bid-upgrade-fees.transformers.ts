import { BidUpgradeFeesApi } from 'api-typings/projects/projects';
import { BidUpgradeFees } from './bid-upgrade-fees.model';

export function transformBidUpgradeFees(
  bidUpgradeFees: BidUpgradeFeesApi,
): BidUpgradeFees {
  return {
    id: bidUpgradeFees.currency.id,
    currency: bidUpgradeFees.currency,
    highlightPrice: bidUpgradeFees.bid_highlight_price,
    sealedPrice: bidUpgradeFees.bid_sealed_price,
    freeHighlight: bidUpgradeFees.free_highlight,
    taxType: bidUpgradeFees.tax_type,
  };
}
