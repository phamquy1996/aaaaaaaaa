import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { IpContractsCollection } from './ip-contracts.types';

export function ipContractsBackend(): Backend<IpContractsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/projects/${
        getQueryParamValue(query, 'projectId')[0]
      }/ip_contracts/`,
      isGaf: false,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
