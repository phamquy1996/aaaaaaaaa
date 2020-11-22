import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { MembershipPackagesCollection } from './membership-packages.types';

export function membershipPackagesBackend(): Backend<
  MembershipPackagesCollection
> {
  return {
    defaultOrder: {
      field: 'order',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'memberships/0.1/packages/',
      isGaf: false,
      params: {
        packages: ids,
        package_names: getQueryParamValue(query, 'internalName'),
        categories: getQueryParamValue(query, 'categoryId'),
        currencies:
          query &&
          query.searchQueryParams &&
          query.searchQueryParams.currencies,
        duration_type:
          query &&
          query.searchQueryParams &&
          query.searchQueryParams.durationType,
        duration_cycle:
          query &&
          query.searchQueryParams &&
          query.searchQueryParams.durationCycle,
        user_ids:
          query && query.searchQueryParams && query.searchQueryParams.userIds,
        price_details: 'true',
        benefit_details: 'true',
        amount_with_tax: 'true',
        include_contract_price: 'true',
        package_map: 'false',
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
