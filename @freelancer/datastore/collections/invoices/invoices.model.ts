import {
  InvoiceStatusApi,
  ProjectInvoiceMilestoneLinkedStatusesApi,
} from 'api-typings/payments/payments';
import { Currency } from '../currencies/currencies.model';

// In order to prevent blocking projects in an invalid state from proceeding
// as before, we need to only disable creating milestones under certain conditions.
// after this date. T150145
export const UNLINKED_DISABLE_DATE = new Date('03/17/2020').getTime();
/**
 * An invoice for an hourly project.
 */
export interface Invoice {
  readonly id: number;
  readonly employerId: number;
  readonly freelancerId: number;
  readonly projectId: number;
  readonly bidId?: number;
  readonly milestoneId?: number;
  readonly milestoneLinkedStatus: ProjectInvoiceMilestoneLinkedStatusesApi;
  readonly status?: InvoiceStatusApi;
  readonly isAutomatic?: boolean;
  readonly isExternal?: boolean;
  readonly currency?: Currency;
  readonly timeRaised?: number;
  readonly periodEnd?: number;
  readonly periodStart?: number;
  readonly totalHours: number;
  readonly totalHoursAmount: number;
  readonly totalResultAmount: number;
  readonly totalOtherAmount: number;
  readonly totalMilestoneAmount: number;
}
