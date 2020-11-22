import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { MembershipPackagePricesCollection } from './membership-package-prices.types';

export function membershipPackagePricesBackend(): Backend<
  MembershipPackagePricesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'memberships/0.1/packages/',
      isGaf: false,
      params: {
        packages: ids,
        coupon: getQueryParamValue(query, 'coupon')[0],
        currencies: getQueryParamValue(query, 'currencyId'),
        duration_type: getQueryParamValue(query, 'durationType'),
        duration_cycle: getQueryParamValue(query, 'durationCycle'),
        price_details: 'true',
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
