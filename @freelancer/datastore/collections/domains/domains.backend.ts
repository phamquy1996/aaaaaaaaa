import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { DomainsCollection } from './domains.types';

export function domainsBackend(): Backend<DomainsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'domains/getDomains.php',
      isGaf: true,
      params: {
        domain_name: getQueryParamValue(query, 'domainName')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
