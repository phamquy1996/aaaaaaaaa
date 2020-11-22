import { generateId } from '@freelancer/datastore/testing';
import { HourlyContractBillingCycleApi } from 'api-typings/projects/projects';
import { Bid } from '../bids/bids.model';
import { HourlyContract } from './hourly-contracts.model';

export interface GenerateHourlyContractOptions {
  readonly projectId: number;
  readonly bidId: number;
  readonly bidderId: number;
  readonly currentHourlyRate?: number;
  readonly currentWorkLimit?: number;
  readonly invalidTime?: number;
  readonly active?: boolean;
  readonly timeTrackingStopped?: number;
}

export type GenerateHourlyContractOptionalOptions = Omit<
  GenerateHourlyContractOptions,
  'projectId' | 'bidId' | 'bidderId'
>;

export function autoBillingOnHourlyContract(): GenerateHourlyContractOptionalOptions {
  return {
    timeTrackingStopped: undefined,
  };
}

export function autoBillingOffHourlyContract(): GenerateHourlyContractOptionalOptions {
  return {
    timeTrackingStopped: Date.now(),
  };
}

/**
 *
 * Hourly project will only have one active hourly contract
 * which has an invalid time set to undefined.
 * Whenever user turn off/on the auto billing,
 * the backend will create a new hourly contract.
 *
 */
export function activeHourlyContract(): GenerateHourlyContractOptionalOptions {
  return {
    invalidTime: undefined,
    active: true,
  };
}

export function inactiveHourlyContract(): GenerateHourlyContractOptionalOptions {
  return {
    invalidTime: Date.now(),
    active: false,
  };
}

export function hourlyContractFromBid(
  bid: Bid,
): Pick<GenerateHourlyContractOptions, 'projectId' | 'bidId' | 'bidderId'> {
  return {
    projectId: bid.projectId,
    bidId: bid.id,
    bidderId: bid.bidderId,
  };
}

export function generateHourlyContractObject({
  projectId,
  bidId,
  bidderId,
  currentHourlyRate = 20,
  currentWorkLimit = 40,
  invalidTime,
  timeTrackingStopped,
  active = true,
}: GenerateHourlyContractOptions): HourlyContract {
  return {
    id: generateId(),
    projectId,
    bidId,
    bidderId,
    billingCycle: HourlyContractBillingCycleApi.WEEKLY,
    invoicePaymentMethod: 'automatic',
    currentHourlyRate,
    currentWorkLimit,
    invalidTime,
    timeTrackingStopped,
    active,
  };
}
