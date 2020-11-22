import { DeloitteSubscriberEmailsGetResultApi } from './deloitte-subscriber-emails.backend-model';
import { DeloitteSubscriberEmails } from './deloitte-subscriber-emails.model';

export function transformDeloitteSubscriberEmails(
  deloitteSubscriberEmails: DeloitteSubscriberEmailsGetResultApi,
): DeloitteSubscriberEmails {
  return {
    id: `${deloitteSubscriberEmails.id}`,
    emails: deloitteSubscriberEmails.emails,
  };
}
