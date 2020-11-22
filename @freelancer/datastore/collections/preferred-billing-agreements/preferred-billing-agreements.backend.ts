import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { PreferredPaymentMethodUpdateRequestApi } from 'api-typings/payments/payments';
import { PreferredBillingAgreementsCollection } from './preferred-billing-agreements.types';

export function preferredBillingAgreementsBackend(): Backend<
  PreferredBillingAgreementsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'payments/0.1/preferred_authorizations',
      params: {
        bid_ids: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, delta, original) => {
      const endpoint = 'payments/0.1/preferred_authorization';
      const method = 'PUT';
      let payload: PreferredPaymentMethodUpdateRequestApi = {
        bid_id: original.id,
      };
      if (delta.billingAgreement) {
        payload = {
          bid_id: original.id,
          payment_source_token: delta.billingAgreement.token,
          deposit_method: delta.billingAgreement.depositMethod,
        };
      }
      return {
        payload,
        endpoint,
        method,
      };
    },
    remove: undefined,
  };
}
