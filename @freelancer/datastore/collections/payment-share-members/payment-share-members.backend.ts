import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { PaymentShareMembersCollection } from './payment-share-members.types';

export function paymentShareMembersBackend(): Backend<
  PaymentShareMembersCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'users/0.1/payment_sharing/members',
      isGaf: false,
      params: {
        payment_share_team_id: getQueryParamValue(
          query,
          'paymentShareTeamId',
        )[0],
        member_entity_id: getQueryParamValue(query, 'entityId')[0],
        member_entity_type: getQueryParamValue(query, 'entityType')[0],
        status: getQueryParamValue(query, 'status')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
