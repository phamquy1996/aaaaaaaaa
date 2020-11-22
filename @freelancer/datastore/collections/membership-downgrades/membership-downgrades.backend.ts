import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { DowngradeStatusApi } from 'api-typings/memberships/memberships_types';
import { MembershipDowngradesCollection } from './membership-downgrades.types';

export function membershipDowngradesBackend(): Backend<
  MembershipDowngradesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'memberships/0.1/downgrades/',
      params: {
        statuses: [DowngradeStatusApi.PENDING],
        price_details: true,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: (authUid, downgradeId, originalDocument) => {
      const method = 'DELETE';
      const endpoint = `memberships/0.1/downgrades/`;
      const payload = {
        downgrades: [toNumber(downgradeId)],
      };
      return {
        payload,
        endpoint,
        method,
      };
    },
  };
}
