import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformBidUpgradeFees } from './bid-upgrade-fees.transformers';
import { BidUpgradeFeesCollection } from './bid-upgrade-fees.types';

export function bidUpgradeFeesReducer(
  state: CollectionStateSlice<BidUpgradeFeesCollection> = {},
  action: CollectionActions<BidUpgradeFeesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'bidUpgradeFees') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BidUpgradeFeesCollection>(
          state,
          transformIntoDocuments(
            result.bid_upgrade_fees,
            transformBidUpgradeFees,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
