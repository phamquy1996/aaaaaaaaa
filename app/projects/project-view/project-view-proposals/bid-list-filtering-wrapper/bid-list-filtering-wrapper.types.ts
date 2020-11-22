import { FormControl } from '@angular/forms';
import {
  Country,
  ProjectViewBid,
  Qualification,
} from '@freelancer/datastore/collections';

export enum BidListFilters {
  BID_AMOUNT_MIN = 'bidAmountMin',
  BID_AMOUNT_MAX = 'bidAmountMax',
  BID_AMOUNT_MIN_INPUT = 'bidAmountMinInput',
  BID_AMOUNT_MAX_INPUT = 'bidAmountMaxInput',
  BID_DELIVERY_TIME = 'bidDeliveryTime',
  BID_RATING = 'bidRating',
  USER_JOB_COMPLETION = 'userJobCompletion',
  PREFERRED_FREELANCERS = 'preferredFreelancers',
  USER_EXAM_TAKEN = 'userExamTaken',
  PROPOSAL_RATED = 'proposalRated',
  USER_HIDDEN = 'userHidden',
  USER_LOCATION = 'userLocation',
  USER_PORTFOLIO = 'userPortfolio',
  USER_ONLINE = 'userOnline',
  USER_RATING = 'userRating',
  USER_REVIEWS_MIN = 'userReviewsMin',
  USER_COUNTRY = 'userCountry',
}

export enum BidView {
  BID_LIST_VIEW = 'bidListView',
  MAP_VIEW = 'mapView',
}

export interface BidListCurrentFilters {
  [BidListFilters.BID_AMOUNT_MAX]: number;
  [BidListFilters.BID_AMOUNT_MIN]: number;
  [BidListFilters.BID_DELIVERY_TIME]: number;
  [BidListFilters.BID_RATING]: number;
  [BidListFilters.USER_RATING]: number;
  [BidListFilters.USER_JOB_COMPLETION]: number;
  [BidListFilters.PREFERRED_FREELANCERS]: boolean;
  [BidListFilters.USER_EXAM_TAKEN]: ReadonlyArray<string>;
  [BidListFilters.PROPOSAL_RATED]: boolean;
  [BidListFilters.USER_HIDDEN]: boolean;
  [BidListFilters.USER_LOCATION]: number;
  [BidListFilters.USER_PORTFOLIO]: boolean;
  [BidListFilters.USER_ONLINE]: boolean;
  [BidListFilters.USER_REVIEWS_MIN]: number;
  [BidListFilters.USER_COUNTRY]: ReadonlyArray<string>;
}

export enum BidListSortingOptions {
  BID_AMOUNT_HIGHEST = 'Amount Highest',
  BID_AMOUNT_LOWEST = 'Amount Lowest',
  PROPOSAL_LATEST = 'Latest Proposals',
  PROPOSAL_OLDEST = 'Oldest Proposals',
  RECOMMENDED = 'Recommended',
  // Not exposed to user
  BID_OWNER = 'bidOwner',
  BID_STATUS = 'bidStatus',
}

export interface UserReviewsSlider {
  minValue: number;
  maxValue: number;
}

export interface BidAmountSlider {
  minValue: number;
  maxValue: number;
}

/**
 * If the return number is -, A will be shown before B.
 * If the return number is +, A will be shown after B.
 * If the return number is 0, A and B will remain in the same order as when they entered the loop.
 */
export type SortingFunction = (a: ProjectViewBid, b: ProjectViewBid) => number;

export enum OrderingDirection {
  ASC = 1,
  DESC = -1,
}

export const RECRUITER_ONBOARDED_EVENT = 'SeenRecruiterBanner';

export interface FreelancerBidRank {
  rank: number;
  total: number;
}

export type ExamCount = Qualification & { count: number };
export type ExamControl = ExamCount & { control: FormControl };

export type CountryCount = Country & { count: number };
