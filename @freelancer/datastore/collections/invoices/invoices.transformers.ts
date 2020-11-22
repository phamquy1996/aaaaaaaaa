import { WebsocketInvoiceUpdatedEvent } from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import {
  InvoiceApi,
  ProjectInvoiceMilestoneLinkedStatusesApi,
} from 'api-typings/payments/payments';
import { transformCurrency } from '../currencies/currencies.transformers';
import { Invoice } from './invoices.model';

export const transformInvoice = (invoice: InvoiceApi): Invoice => {
  if (
    !invoice.id ||
    !invoice.employer_id ||
    !invoice.freelancer_id ||
    !invoice.project_id
  ) {
    throw Error('Invoice is missing a required field.');
  }
  return {
    id: invoice.id,
    employerId: invoice.employer_id,
    freelancerId: invoice.freelancer_id,
    projectId: invoice.project_id,
    bidId: invoice.bid_id,
    status: invoice.status,
    isExternal: invoice.is_external,
    isAutomatic: invoice.is_automatic,
    currency: invoice.currency
      ? transformCurrency(invoice.currency)
      : undefined,
    timeRaised: invoice.time_raised && invoice.time_raised * 1000,
    periodEnd: invoice.period_end && invoice.period_end * 1000,
    periodStart: invoice.period_start && invoice.period_start * 1000,
    milestoneId: invoice.milestone_id,
    milestoneLinkedStatus:
      invoice.milestone_id === undefined
        ? ProjectInvoiceMilestoneLinkedStatusesApi.UNLINKED
        : ProjectInvoiceMilestoneLinkedStatusesApi.LINKED,
    totalHours: invoice.total_hours || 0,
    totalHoursAmount: invoice.total_hours_amount || 0,
    totalResultAmount: invoice.total_result_amount || 0,
    totalOtherAmount: invoice.total_other_amount || 0,
    totalMilestoneAmount: invoice.total_milestone_amount || 0,
  };
};

export const transformWebSocketUpdatedInvoiceEvent = (
  event: WebsocketInvoiceUpdatedEvent,
): Invoice => {
  const { data } = event;

  return {
    id: data.invoiceId,
    employerId: data.buyerId,
    freelancerId: data.sellerId,
    projectId: data.projectId,
    bidId: data.bidId,
    status: data.status,
    isExternal: data.isExternal,
    isAutomatic: data.isAutomatic,
    currency: transformCurrency(data.currency),
    timeRaised: data.timeRaised * 1000,
    periodEnd: data.periodEnd * 1000,
    periodStart: data.periodStart * 1000,
    milestoneId: data.milestoneId || undefined,
    milestoneLinkedStatus: isDefined(data.milestoneId)
      ? ProjectInvoiceMilestoneLinkedStatusesApi.LINKED
      : ProjectInvoiceMilestoneLinkedStatusesApi.UNLINKED,
    totalHours: data.totalHours,
    totalHoursAmount: data.totalHoursAmount,
    totalResultAmount: data.totalResultAmount,
    totalOtherAmount: data.totalOtherAmount,
    totalMilestoneAmount: data.totalMilestoneAmount,
  };
};
