import { PFSupportTicketsPostRawPayload } from './pf-support-tickets.backend-model';
import { PFSupportTicket } from './pf-support-tickets.model';

export function transformPFSupportTicket(
  pfSupportTicket: PFSupportTicketsPostRawPayload,
): PFSupportTicket {
  return {
    id: Date.now(),
    message: pfSupportTicket.message,
  };
}
