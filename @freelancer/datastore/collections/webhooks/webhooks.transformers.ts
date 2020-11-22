import { WebhookApi } from 'api-typings/users/users';
import { Webhook } from './webhooks.model';

export function transformWebhooks(webhook: WebhookApi): Webhook {
  if (!webhook.id || !webhook.application_id || !webhook.url) {
    throw new Error('Malformed webhook object');
  }
  return {
    id: webhook.id,
    applicationId: webhook.application_id,
    inactive: webhook.inactive || false,
    url: webhook.url,
    inactiveReason: webhook.inactive_reason,
    timeCreated: webhook.time_created ? webhook.time_created * 1000 : undefined,
  };
}
