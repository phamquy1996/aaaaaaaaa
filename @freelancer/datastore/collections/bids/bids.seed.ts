import {
  generateId,
  generateNumbersInRangeWithDuplicates,
  getNovelLine,
} from '@freelancer/datastore/testing';
import { FrontendBidStatusApi } from 'api-typings/common/common';
import {
  BidAwardStatusApi,
  BidCompleteStatusApi,
  BidPaidStatusApi,
} from 'api-typings/projects/projects';
import { Project } from '../projects';
import { AWARD_EXPIRY_INTERVAL, Bid } from './bids.model';

export interface GenerateBidOptions {
  readonly bidderId: number;
  readonly projectId: number;
  readonly projectOwnerId: number;
  readonly amount: number;
  readonly period: number;
  readonly description?: string;
  readonly milestonePercentage?: number;
  readonly submitDate?: number;

  readonly awardStatus?: BidAwardStatusApi;
  readonly paidStatus?: BidPaidStatusApi;
  readonly completeStatus?: BidCompleteStatusApi;
  readonly frontendBidStatus?: FrontendBidStatusApi; // do not rely on this

  readonly timeAccepted?: number;
  readonly timeAwarded?: number;
  readonly awardStatusChangedTime?: number;
  readonly awardExpireTime?: number;
  readonly completeStatusChangedTime?: number;
}

export interface GenerateBidsOptions {
  readonly bidderIds: ReadonlyArray<number>;
  readonly projectId: number;
  readonly projectOwnerId: number;

  // These are user IDs
  // They map one-to-one to bid.awardStatus, so only one will be applied.
  readonly awardedIds?: ReadonlyArray<number>;
  readonly acceptedIds?: ReadonlyArray<number>;
  readonly revokedIds?: ReadonlyArray<number>;
  readonly rejectedIds?: ReadonlyArray<number>;
  readonly canceledIds?: ReadonlyArray<number>;

  // These map one-to-one to bid.completeStatus
  readonly completeIds?: ReadonlyArray<number>;
  readonly incompleteIds?: ReadonlyArray<number>;

  // paidStatus is separate from awardStatus
  readonly partlyPaidIds?: ReadonlyArray<number>;
  readonly fullyPaidIds?: ReadonlyArray<number>;

  readonly minAmount?: number;
  readonly maxAmount?: number;
  readonly minPeriod?: number;
  readonly maxPeriod?: number;
  readonly minMilestonePercentage?: number;
  readonly maxMilestonePercentage?: number;
}

// Selected bids always belong to a project, so projectId and projectOwnerId
// should be optional
export type GenerateSelectedBidsOptions = Pick<
  GenerateBidsOptions,
  'bidderIds'
> &
  Partial<GenerateBidsOptions>;

// Mixins to build options to pass into `createBid`
// TODO: Support mixing bids with different statuses
export function awardedBid({
  bidderIds = [],
}: {
  readonly bidderIds: ReadonlyArray<number> | undefined;
}): GenerateSelectedBidsOptions {
  return {
    bidderIds,
    awardedIds: bidderIds,
  };
}

export function acceptedBid({
  bidderIds = [],
}: {
  readonly bidderIds: ReadonlyArray<number> | undefined;
}): GenerateSelectedBidsOptions {
  return {
    bidderIds,
    acceptedIds: bidderIds,
  };
}

export function partlyPaidCompleteBid({
  bidderIds = [],
}: {
  readonly bidderIds: ReadonlyArray<number> | undefined;
}): GenerateSelectedBidsOptions {
  return {
    bidderIds,
    completeIds: bidderIds,
    partlyPaidIds: bidderIds,
  };
}

export function fullyPaidCompleteBid({
  bidderIds = [],
}: {
  readonly bidderIds: ReadonlyArray<number> | undefined;
}): GenerateSelectedBidsOptions {
  return {
    bidderIds,
    completeIds: bidderIds,
    fullyPaidIds: bidderIds,
  };
}

export function incompleteBid({
  bidderIds = [],
}: {
  readonly bidderIds: ReadonlyArray<number> | undefined;
}): GenerateSelectedBidsOptions {
  return {
    bidderIds,
    incompleteIds: bidderIds,
  };
}

export type GenerateBidsFromProjectOptions = Pick<
  GenerateBidsOptions,
  'projectId' | 'projectOwnerId'
>;

export function bidsFromProject(
  project: Project,
): GenerateBidsFromProjectOptions {
  return {
    projectId: project.id,
    projectOwnerId: project.ownerId,
  };
}

export function generateBidObject({
  bidderId,
  projectId,
  projectOwnerId,
  period,
  amount,
  description = getNovelLine('prideAndPrejudice', 0),
  milestonePercentage = 50, // unused
  submitDate,
  awardStatus,
  paidStatus,
  completeStatus,
  frontendBidStatus, // do not rely on this
  timeAccepted,
  timeAwarded,
  awardStatusChangedTime,
  completeStatusChangedTime,
}: GenerateBidOptions): Bid {
  const now = Date.now();

  return {
    id: generateId(),
    bidderId,
    projectId,
    projectOwnerId,
    description,

    period,
    amount,
    milestonePercentage,

    submitDate: submitDate ?? now,
    timeSubmitted: submitDate,

    retracted: false,
    highlighted: false,
    shortlisted: false,
    hidden: false,
    sealed: false,

    awardStatus,
    paidStatus,
    completeStatus,

    frontendBidStatus, // do not rely on this
    timeAccepted,
    timeAwarded,
    awardStatusChangedTime,
    awardExpireTime: timeAwarded
      ? timeAwarded + AWARD_EXPIRY_INTERVAL
      : undefined,
    completeStatusChangedTime,
  };
}

export function generateBidObjects({
  bidderIds,
  projectId,
  projectOwnerId,
  awardedIds = [],
  acceptedIds = [],
  revokedIds = [],
  rejectedIds = [],
  canceledIds = [],
  completeIds = [],
  incompleteIds = [],
  partlyPaidIds = [],
  fullyPaidIds = [],
  minAmount = 10,
  maxAmount = 20,
  minPeriod = 1,
  maxPeriod = 1,
  minMilestonePercentage = 100,
  maxMilestonePercentage = 100,
}: GenerateBidsOptions): ReadonlyArray<Bid> {
  const amounts = generateNumbersInRangeWithDuplicates(
    minAmount,
    maxAmount,
    bidderIds.length,
    'amounts',
  );

  const periods = generateNumbersInRangeWithDuplicates(
    minPeriod,
    maxPeriod,
    bidderIds.length,
    'periods',
  );

  const milestonePercentages = generateNumbersInRangeWithDuplicates(
    minMilestonePercentage,
    maxMilestonePercentage,
    bidderIds.length,
    'milestones',
  );

  const now = Date.now();

  return bidderIds.map((bidderId, index) =>
    generateBidObject({
      bidderId,
      projectId,
      projectOwnerId,
      description: getNovelLine('prideAndPrejudice', index),

      period: periods[index],
      amount: amounts[index],
      milestonePercentage: milestonePercentages[index],

      submitDate: now - index * 5, // so that bid sorting is realistic
      timeSubmitted: now - index * 5,

      // In reverse order of progress through the project funnel so that parameter
      // defaults don't override things incorrectly. Intuitively this is because
      // a complete bid had to have been accepted before, and an accepted bid had
      // to have been awarded before, etc.
      ...(incompleteIds.includes(bidderId)
        ? getIncompleteBidDetails(now)
        : completeIds.includes(bidderId) &&
          (partlyPaidIds.includes(bidderId) || fullyPaidIds.includes(bidderId))
        ? getCompleteBidDetails(now)
        : canceledIds.includes(bidderId)
        ? getCancelledBidDetails(now)
        : rejectedIds.includes(bidderId)
        ? getRejectedBidDetails(now)
        : revokedIds.includes(bidderId)
        ? getRevokedBidDetails(now)
        : acceptedIds.includes(bidderId)
        ? getAcceptedBidDetails(now)
        : awardedIds.includes(bidderId)
        ? getAwardedBidDetails(now)
        : {}),

      // Paid status is independent of award and complete statuses, so merge them separately
      ...(partlyPaidIds.includes(bidderId)
        ? {
            paidStatus: BidPaidStatusApi.PARTLY_PAID,
            paidAmount: Math.round(amounts[index] * 0.5),
          }
        : fullyPaidIds.includes(bidderId)
        ? {
            paidStatus: BidPaidStatusApi.FULLY_PAID,
            paidAmount: amounts[index],
          }
        : { paidAmount: 0 }),
    }),
  );
}

/** Employer awards freelancer's bid */
function getAwardedBidDetails(now: number): Partial<Bid> {
  return {
    awardStatus: BidAwardStatusApi.PENDING,
    paidStatus: BidPaidStatusApi.UNPAID,
    completeStatus: BidCompleteStatusApi.PENDING,
    frontendBidStatus: FrontendBidStatusApi.ACTIVE, // do not rely on this
    timeAwarded: now,
    awardStatusChangedTime: now,
  };
}

/** Freelancer accepts employer's award */
function getAcceptedBidDetails(now: number): Partial<Bid> {
  return {
    awardStatus: BidAwardStatusApi.AWARDED,
    paidStatus: BidPaidStatusApi.UNPAID,
    completeStatus: BidCompleteStatusApi.PENDING,
    frontendBidStatus: FrontendBidStatusApi.IN_PROGRESS, // do not rely on this
    timeAwarded: now,
    awardStatusChangedTime: now,
    timeAccepted: now,
  };
}

/** Employer revokes awarded bid */
function getRevokedBidDetails(now: number): Partial<Bid> {
  return {
    awardStatus: BidAwardStatusApi.REVOKED,
    paidStatus: BidPaidStatusApi.UNPAID,
    completeStatus: BidCompleteStatusApi.PENDING,
    frontendBidStatus: FrontendBidStatusApi.ACTIVE, // do not rely on this
    timeAwarded: now,
    awardStatusChangedTime: now,
  };
}

/** Freelancer rejects employer's award */
function getRejectedBidDetails(now: number): Partial<Bid> {
  return {
    awardStatus: BidAwardStatusApi.REJECTED,
    paidStatus: BidPaidStatusApi.UNPAID,
    completeStatus: BidCompleteStatusApi.PENDING,
    frontendBidStatus: FrontendBidStatusApi.ACTIVE, // do not rely on this
    timeAwarded: now,
    awardStatusChangedTime: now,
  };
}

/**
 * Employer cancels the accepted bid by ending the bid as complete without any milestones.
 * Note that ending the bid as incomplete does NOT result in a `cancelled` award status.
 */
function getCancelledBidDetails(now: number): Partial<Bid> {
  return {
    awardStatus: BidAwardStatusApi.CANCELED,
    paidStatus: BidPaidStatusApi.UNPAID,
    completeStatus: BidCompleteStatusApi.PENDING,
    frontendBidStatus: FrontendBidStatusApi.ACTIVE, // do not rely on this
    timeAwarded: now,
    awardStatusChangedTime: now,
    timeAccepted: now,
    completeStatusChangedTime: now,
  };
}

/** Employer ends the bid as complete with either full or partial milestone payment */
function getCompleteBidDetails(now: number): Partial<Bid> {
  return {
    awardStatus: BidAwardStatusApi.AWARDED,
    paidStatus: BidPaidStatusApi.UNPAID,
    completeStatus: BidCompleteStatusApi.COMPLETE,
    frontendBidStatus: FrontendBidStatusApi.COMPLETE, // do not rely on this
    timeAwarded: now,
    awardStatusChangedTime: now,
    timeAccepted: now,
    completeStatusChangedTime: now,
  };
}

/** Employer ends the bid as incomplete with either partial or no milestone payment*/
function getIncompleteBidDetails(now: number): Partial<Bid> {
  return {
    awardStatus: BidAwardStatusApi.AWARDED,
    paidStatus: BidPaidStatusApi.UNPAID,
    completeStatus: BidCompleteStatusApi.INCOMPLETE,
    frontendBidStatus: FrontendBidStatusApi.IN_PROGRESS, // do not rely on this
    timeAccepted: now,
    awardStatusChangedTime: now,
    timeAwarded: now,
    completeStatusChangedTime: now,
  };
}
