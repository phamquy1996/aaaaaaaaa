import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { PfSupportTicketsCollection } from './pf-support-tickets.types';

export function pfSupportTicketsBackend(): Backend<PfSupportTicketsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: undefined,
    push: (_, pfSupportTicket) => ({
      endpoint: 'preferred-freelancer/support-ticket.php',
      isGaf: true,
      asFormData: false,
      payload: {
        message: pfSupportTicket.message,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
