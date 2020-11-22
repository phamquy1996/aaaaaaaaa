import { UserEmailRequestAjax } from '@freelancer/datastore/collections';
import { EmailChangeRequest } from './email-verification.model';

export function transformEmailChangeRequest(
  request: UserEmailRequestAjax,
): EmailChangeRequest {
  return {
    id: request.id,
    email: request.email,
    ipAddress: request.ip_address,
    status: request.status,
  };
}
