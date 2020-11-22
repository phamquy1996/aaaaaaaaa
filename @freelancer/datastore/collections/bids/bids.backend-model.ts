import {
  BidApi,
  BidCompleteStatusApi,
  BidDenyReasonApi,
  HourlyContractBillingCycleApi,
} from 'api-typings/projects/projects';

export type BidUpdateActionRawPayload =
  | {
      readonly action: BidsPutActions;
      readonly reason_code?: BidDenyReasonApi;
      readonly other_feedback?: string;
    }
  | Partial<BidsPostRawPayload>
  | BidAwardPutRawPayload
  | BidCompletePutRawPayload
  // For bid rating create and update.
  | BidRatingsPostRawPayload
  | BidRatingsUpdateRawPayload;

export interface BidsPostRawPayload {
  readonly project_id: number;
  readonly bidder_id: number;
  readonly amount: number;
  readonly period: number;
  readonly milestone_percentage: number;
  readonly description?: string;
}

export type BidsPostApiResponse = BidApi;

export interface BidAwardPutRawPayload {
  readonly action: BidEmployerActions.AWARD;
  readonly work_limit?: number;
  readonly billing_cycle?: HourlyContractBillingCycleApi;
  readonly skip_hourly_contract?: boolean;
}

export type BidsPutActions = BidOwnerActions | BidEmployerActions;

export enum BidOwnerActions {
  ACCEPT = 'accept',
  DENY = 'deny',
  RETRACT = 'retract',
  HIGHLIGHT = 'highlight',
  SPONSOR = 'sponsor', // TODO with amount
}

export enum BidEmployerActions {
  REVOKE = 'revoke',
  SHORTLIST = 'shortlist',
  UNSHORTLIST = 'unshortlist',
  AWARD = 'award',
  HIDE = 'hide',
  UNHIDE = 'unhide',
  REQUEST_LOCATION_SHARING = 'request_location_sharing',
}

/**
 * FIXME: t.e.m.p.o.r.a.r.y duplicate of ProjectAction in the 'projects' collection
 * until it's added to Thrift. For the purpose of avoiding circular dependencies
 */
export enum BidProjectAction {
  SIGN_NDA = 'sign_nda',
  UPGRADE = 'upgrade',
  SET_LOCATION = 'set_location',
  CLOSE = 'close',
  ADD_ATTACHMENT = 'add_attachment',
  END = 'end',
}

export interface BidCompletePutRawPayload {
  readonly action: BidProjectAction.END;
  readonly bid_id: number;
  readonly status: BidCompleteStatusApi;
}

// Recruiter selected bid will have 99 as its bid score (ref: D122137)
export const RECRUITER_RECOMMENDED_SCORE = 99;
export const RECOMMENDED_CUTOFF = 0.85;

export interface BidRatingsPostRawPayload {
  readonly bid_id: number;
  readonly comment?: string;
  readonly rating: number;
}

export interface BidRatingsUpdateRawPayload {
  readonly id: number;
  readonly comment?: string;
  readonly rating: number;
}
