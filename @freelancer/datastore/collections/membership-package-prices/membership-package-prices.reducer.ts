import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { flatten, isDefined } from '@freelancer/utils';
import { transformMembershipPackagePrice } from '../recommended-membership/recommended-membership.transformers';
import { MembershipPackagePricesCollection } from './membership-package-prices.types';

export function membershipPackagePricesReducer(
  state: CollectionStateSlice<MembershipPackagePricesCollection> = {},
  action: CollectionActions<MembershipPackagePricesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'membershipPackagePrices') {
        const { result, ref, order } = action.payload;
        const packages = flatten(result.map(pkgs => pkgs.packages));
        return mergeDocuments<MembershipPackagePricesCollection>(
          state,
          transformIntoDocuments(
            flatten(packages.map(pkg => pkg.prices).filter(isDefined)),
            transformMembershipPackagePrice,
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
