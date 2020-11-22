import { FrontendBidStatusApi } from 'api-typings/common/common';
import {
  BidAwardStatusApi,
  BidCompleteStatusApi,
  BidDenyReasonApi,
  BidHiddenReasonApi,
  BidPaidStatusApi,
  HourlyContractBillingCycleApi,
  NegotiatedOfferApi,
} from 'api-typings/projects/projects';
import { Currency } from '../currencies/currencies.model';

/**
 * A bid placed on a project.
 */
export interface Bid {
  readonly id: number;
  readonly bidderId: number;
  readonly projectId: number;
  readonly retracted?: boolean;
  readonly amount: number;
  readonly period: number;
  readonly description?: string;
  readonly projectOwnerId?: number;
  readonly submitDate: number;
  readonly buyerProjectFee?: Fee;
  readonly timeSubmitted?: number;
  readonly highlighted?: boolean;
  readonly sponsored?: number;
  readonly milestonePercentage?: number;
  readonly awardStatusPossibilities?: ReadonlyArray<BidAwardStatusApi>;

  // These statuses only appear after the bid is awarded. See `selected_seller` DB table
  readonly awardStatus?: BidAwardStatusApi;
  readonly paidStatus?: BidPaidStatusApi;
  readonly completeStatus?: BidCompleteStatusApi;

  readonly timeAwarded?: number;
  readonly frontendBidStatus?: FrontendBidStatusApi;
  readonly shortlisted?: boolean;
  readonly score?: number;
  readonly distance?: number;
  readonly negotiatedOffer?: NegotiatedOfferApi;
  readonly hidden?: boolean;
  readonly hiddenReason?: BidHiddenReasonApi;
  readonly timeAccepted?: number;
  readonly paidAmount?: number;
  readonly hourlyRate?: number;
  readonly isLocationTracked?: boolean;
  /** 36 hours after bid is awarded */
  readonly awardExpireTime?: number;

  readonly extraForUpdate?: BidAwardExtraFields;
  readonly sealed?: boolean;
  readonly completeStatusChangedTime?: number;
  readonly awardStatusChangedTime?: number;
  readonly rejectReasonCode?: BidDenyReasonApi;
  readonly otherFeedback?: string;
  readonly rating?: BidRating;
}

// FIXME: Buyer/employer project fee on awarded bids - why does the award modal
// not use this projection on the bids collection directly, instead of making
// a new one?
export interface Fee {
  readonly amount: number;
  readonly is_taxed: boolean;
  readonly currency?: Currency;
  readonly rate?: number;
  readonly rate_with_tax?: number;
}

export interface BidAwardExtraFields {
  // Extra fields for update method
  readonly workLimit?: number;
  readonly billingCycle?: HourlyContractBillingCycleApi;
  readonly skipHourlyContract?: boolean;
}

/** Bid is automatically revoked 36 hours after award */
export const AWARD_EXPIRY_INTERVAL = 36 * 60 * 60 * 1000;

/**
 * Bids can be rated by employers, and this information is represented
 * in this interface.
 *
 * Bid ratings will primarily be fetched and updated on the Proposals tab
 * of the Project View page
 */
export interface BidRating {
  readonly authorId: number;
  readonly bidId: number;
  readonly comment?: string;
  readonly id: number;
  readonly rating: number;
  readonly timeCreated?: number;
  readonly timeUpdated?: number;
}
