import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ContestHasInvoicesCollection } from './contest-has-invoices.types';

export function contestHasInvoiceBackend(): Backend<
  ContestHasInvoicesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/getHasContestInvoice.php',
      isGaf: true,
      params: {
        contest_ids: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
