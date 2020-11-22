import { generateId } from '@freelancer/datastore/testing';
import {
  InvoiceStatusApi,
  ProjectInvoiceMilestoneLinkedStatusesApi,
} from 'api-typings/payments/payments';
import { Invoice } from './invoices.model';

export interface GenerateInvoiceOptions {
  readonly employerId: number;
  readonly freelancerId: number;
  readonly projectId: number;
  readonly bidId?: number;
  readonly milestoneId?: number;
  readonly milestoneLinkedStatus?: ProjectInvoiceMilestoneLinkedStatusesApi;
  readonly status?: InvoiceStatusApi;
  readonly totalHours: number;
  readonly totalHoursAmount: number;
  readonly totalResultAmount: number;
  readonly totalOtherAmount: number;
  readonly totalMilestoneAmount: number;
}

export function generateInvoiceObject({
  employerId,
  freelancerId,
  projectId,
  bidId,
  milestoneId,
  milestoneLinkedStatus = ProjectInvoiceMilestoneLinkedStatusesApi.UNLINKED,
  status,
  totalHours = 1,
  totalHoursAmount = 20,
  totalResultAmount = 20,
  totalOtherAmount = 0,
  totalMilestoneAmount = 20,
}: GenerateInvoiceOptions): Invoice {
  return {
    id: generateId(),
    employerId,
    freelancerId,
    projectId,
    bidId,
    milestoneId,
    milestoneLinkedStatus,
    status,
    totalHours,
    totalHoursAmount,
    totalResultAmount,
    totalOtherAmount,
    totalMilestoneAmount,
  };
}
