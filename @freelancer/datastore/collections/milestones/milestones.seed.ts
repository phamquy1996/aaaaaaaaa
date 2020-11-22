import { generateId } from '@freelancer/datastore/testing';
import { MilestoneStatusApi } from 'api-typings/projects/projects';
import { Bid } from '../bids/bids.model';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { Milestone } from './milestones.model';

export interface GenerateMilestoneOptions {
  readonly bidderId: number;
  readonly bidId: number;
  readonly projectId: number;
  readonly projectOwnerId: number;
  readonly amount?: number;
  readonly currencyCode?: CurrencyCode;
  readonly description?: string;

  // Each maps to a mutually exclusive milestone.status - only one will be applied
  readonly released?: boolean;

  readonly cancellationRequested?: boolean;
}

export function generateMilestoneObject({
  bidId,
  bidderId,
  projectId,
  projectOwnerId,
  amount = 1,
  released = false,
  cancellationRequested = false,
  currencyCode = CurrencyCode.USD,
  description = 'Default milestone description',
}: GenerateMilestoneOptions): Milestone {
  const now = Date.now();
  const currency = generateCurrencyObject(currencyCode);

  return {
    id: generateId(),
    bidId,
    bidderId,
    projectId,
    projectOwnerId,
    amount,
    timeCreated: now,
    cancellationRequested: !released && cancellationRequested,
    currency,
    description,

    ...(released
      ? { status: MilestoneStatusApi.CLEARED, timeReleased: now }
      : { status: MilestoneStatusApi.FROZEN }),
  };
}

export function partiallyPaidBidMilestone(
  bid: Bid,
): Partial<GenerateMilestoneOptions> {
  return {
    amount: bid.amount * 0.5,
  };
}

export function fullyPaidBidMilestone(
  bid: Bid,
): Partial<GenerateMilestoneOptions> {
  return {
    amount: bid.amount,
  };
}
