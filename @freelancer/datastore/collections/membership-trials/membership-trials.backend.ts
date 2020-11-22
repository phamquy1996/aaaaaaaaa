import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { MembershipTrialsCollection } from './membership-trials.types';

export function membershipTrialsBackend(): Backend<MembershipTrialsCollection> {
  return {
    defaultOrder: {
      field: 'packageId',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'memberships/0.1/trials/',
      isGaf: false,
      params: {
        packages: getQueryParamValue(query, 'packageId'),
        eligibility: 'true',
        package_details: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
