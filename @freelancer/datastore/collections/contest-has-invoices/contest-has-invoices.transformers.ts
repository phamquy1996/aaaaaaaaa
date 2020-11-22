import { ContestHasInvoiceAjax } from './contest-has-invoices.backend-model';
import { ContestHasInvoice } from './contest-has-invoices.model';

export function transformContestHasInvoice(
  contestHasInvoice: ContestHasInvoiceAjax,
): ContestHasInvoice {
  return {
    id: contestHasInvoice.id,
    hasFeesInvoice: contestHasInvoice.has_fees_invoice,
    hasPrizeInvoice: contestHasInvoice.has_prize_invoice,
  };
}
