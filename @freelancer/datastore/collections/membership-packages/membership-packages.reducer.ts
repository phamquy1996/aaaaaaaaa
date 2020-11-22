import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { PackageApi } from 'api-typings/memberships/memberships_types';
import { transformMembershipPackage } from './membership-packages.transformers';
import { MembershipPackagesCollection } from './membership-packages.types';

export function membershipPackagesReducer(
  state: CollectionStateSlice<MembershipPackagesCollection> = {},
  action: CollectionActions<MembershipPackagesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'membershipPackages') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MembershipPackagesCollection>(
          state,
          transformIntoDocuments(
            result.reduce<ReadonlyArray<PackageApi>>(
              (prev, curr) => prev.concat(curr.packages),
              [],
            ),
            transformMembershipPackage,
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
