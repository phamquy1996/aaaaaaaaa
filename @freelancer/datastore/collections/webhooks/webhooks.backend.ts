import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { WebhooksCollection } from './webhooks.types';

export function webhooksBackend(): Backend<WebhooksCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/webhooks',
      params: {
        webhooks: ids,
        applications: getQueryParamValue(query, 'applicationId'),
        isActive: 'true',
      },
    }),
    push: (authUid, webhook) => ({
      endpoint: 'users/0.1/webhooks',
      payload: {
        id: Date.now(), // this is slightly dumb
        inactive: false,
        application_id: webhook.applicationId,
        url: webhook.url,
      },
    }),
    set: undefined,
    update: (authUid, webhook, originalWebhook) => {
      if (!webhook.inactive) {
        throw new Error('Currently only deactivation is allowed.');
      }
      if (!webhook.inactiveReason) {
        throw new Error('Must provide reason for deactivation.');
      }
      return {
        endpoint: `users/0.1/webhooks/${originalWebhook.id}`,
        payload: {
          action: 'deactivate', // we don't allow any other actions here currently
          deactivation_reason: webhook.inactiveReason,
        },
        isGaf: false,
        method: 'PUT',
        asFormData: false,
      };
    },
    remove: (authUid, id) => ({
      endpoint: `users/0.1/webhooks/${id}`,
      method: 'DELETE',
      isGaf: false,
      payload: {},
    }),
  };
}
