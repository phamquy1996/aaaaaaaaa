import { PartialBy } from '@freelancer/types';
import { addDays, subDays } from 'date-fns';
import { TimeTrackingSession } from '../time-tracking-session/time-tracking-session.model';
import { BidSummary } from './bid-summaries.model';

export interface GenerateBidSummariesOptions {
  readonly bidId: number;
  readonly totalTrackedTimeInCycle?: number;
  readonly uninvoicedTrackedTimeInCycle?: number;
}

export function generateBidSummariesObject({
  bidId,
  totalTrackedTimeInCycle = 0,
  uninvoicedTrackedTimeInCycle = 0,
}: GenerateBidSummariesOptions): BidSummary {
  return {
    id: bidId,
    milestoneSummary: {
      paidAmount: 0,
      pendingAmount: 0,
    },
    currentHourlyCycleSummary: {
      hourlyRate: 20, // in unit currency
      billingCycleStartTime: getCurrentMondayHelper(Date.now()).getTime(),
      billingCycleEndTime: getCurrentSundayHelper(Date.now()).getTime(),
      timeTrackingLimit: 40 * 60 * 60, // 40 hours in seconds
      totalTrackedTimeInCycle,
      uninvoicedTrackedTimeInCycle,
    },
  };
}

function getCurrentMondayHelper(date: number | string | Date): Date {
  const dateObject = new Date(date);
  const day = dateObject.getDay();

  // adjust when day is sunday
  return subDays(dateObject, day === 0 ? 6 : day - 1);
}

function getCurrentSundayHelper(date: number | string | Date): Date {
  const dateObject = new Date(date);
  // `getDay()` uses the local timezone to decide which day it is
  const day = dateObject.getDay();

  return addDays(dateObject, day === 0 ? 0 : 7 - day);
}

export function sessionToBidSummariesTransformer(
  authUid: number,
  session: PartialBy<TimeTrackingSession, 'id'>,
): BidSummary {
  return {
    id: session.bidId,
    milestoneSummary: { paidAmount: 0, pendingAmount: 0 },
    currentHourlyCycleSummary: {
      hourlyRate: 20, // in unit currency
      billingCycleStartTime: getCurrentMondayHelper(Date.now()).getTime(),
      billingCycleEndTime: getCurrentSundayHelper(Date.now()).getTime(),
      timeTrackingLimit: 40 * 60 * 60, // 40 hours in seconds
      totalTrackedTimeInCycle: 3600,
      uninvoicedTrackedTimeInCycle: 3600,
    },
  };
}
