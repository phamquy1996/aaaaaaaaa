import {
  DELOITTE_BUSINESS_LINE_DISPLAY_NAME_MAP,
  DELOITTE_INDUSTRY_DISPLAY_NAME_MAP,
  DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP,
  DELOITTE_OFFERING_DISPLAY_NAME_MAP,
  DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP,
  DELOITTE_PRACTICE_DISPLAY_NAME_MAP,
  DELOITTE_PROJECT_TYPE_DISPLAY_NAME_MAP,
  DELOITTE_UTILIZATION_DISPLAY_NAME_MAP,
  DELOITTE_WORKER_LEVEL_DISPLAY_NAME_MAP,
} from '@freelancer/datastore/collections';
import * as Rx from 'rxjs';

export interface DeloitteProjectRequirements {
  readonly limitCertifications$: Rx.Observable<
    ReadonlyArray<string> | undefined
  >;
  readonly limitPractices$: Rx.Observable<string | undefined>;
  readonly limitOfferingPortfolios$: Rx.Observable<string | undefined>;
  readonly limitGigWorkerLevel$: Rx.Observable<string | undefined>;
}

// FIXME: Map all below mappings to string because custom field values are in string type
export const DELOITTE_PRACTICE_DISPLAY_NAME_STRING_MAP: {
  readonly [k in string]: string;
} = DELOITTE_PRACTICE_DISPLAY_NAME_MAP;

export const DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_STRING_MAP: {
  readonly [k in string]: string;
} = DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP;

export const DELOITTE_WORKER_LEVEL_DISPLAY_NAME_STRING_MAP: {
  readonly [k in string]: string;
} = DELOITTE_WORKER_LEVEL_DISPLAY_NAME_MAP;

export const DELOITTE_INDUSTRY_DISPLAY_NAME_STRING_MAP: {
  readonly [k in string]: string;
} = DELOITTE_INDUSTRY_DISPLAY_NAME_MAP;

export const DELOITTE_PROJECT_TYPE_DISPLAY_NAME_STRING_MAP: {
  readonly [k in string]: string;
} = DELOITTE_PROJECT_TYPE_DISPLAY_NAME_MAP;

export const DELOITTE_UTILIZATION_DISPLAY_NAME_STRING_MAP: {
  readonly [k in string]: string;
} = DELOITTE_UTILIZATION_DISPLAY_NAME_MAP;

export const DELOITTE_BUSINESS_LINE_DISPLAY_NAME_STRING_MAP: {
  readonly [k in string]: string;
} = DELOITTE_BUSINESS_LINE_DISPLAY_NAME_MAP;

export const DELOITTE_OFFERING_DISPLAY_NAME_STRING_MAP: {
  readonly [k in string]: string;
} = DELOITTE_OFFERING_DISPLAY_NAME_MAP;

export const DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_STRING_MAP: {
  readonly [k in string]: string;
} = DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP;
