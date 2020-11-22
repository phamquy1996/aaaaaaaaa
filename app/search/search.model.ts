import { RequestStatus } from '@freelancer/datastore';
import {
  SearchActiveContestsCollection,
  SearchActiveProjectsCollection,
  SearchUsersCollection,
} from '@freelancer/datastore/collections';

export const DEBOUNCE_TIME = 350;
export const PAGE_SIZE = 10;

export const DEFAULT_EXAM_IDS: ReadonlyArray<string> = [
  '2', // US English - Level 1
  '224', // Adobe Photoshop CS5 - Level 1
  '534', // Data Entry
];

// Default skill id list from /project-create/skills-field/flSkillsField.js
export const DEFAULT_SKILL_IDS: ReadonlyArray<string> = [
  '17', // Website Design
  '32', // Logo Design
  '44', // Mobile App Development
  '39', // Data Entry
  '174', // Article Writing
];

export const PROJECT_TYPES = {
  fixed: 'Fixed Price',
  hourly: 'Hourly Rate',
};

export const PROJECT_UPGRADES = {
  featured: 'Featured',
  sealed: 'Sealed',
  NDA: 'NDA',
  urgent: 'Urgent',
  fulltime: 'Fulltime',
  assisted: 'Recruiter', // `recruiter` exists in the API, but `assisted` is the proper filter
};

export enum DEFAULT_SEARCH_BY_LOCATION_RADIUS {
  PROJECTS = 150,
  USERS = 50,
}

export enum ContestFilters {
  SKILLS = 'contestSkills',
}

export enum ContestSortingOptions {
  NEWEST_FIRST,
  PRIZE_LOW_TO_HIGH,
  PRIZE_HIGH_TO_LOW,
  ENTRIES_LOW_TO_HIGH,
  ENTRIES_HIGH_TO_LOW,
  OLDEST_FIRST,
}

export enum HourlyRateFilterRange {
  MINIMUM = 2,
  MAXIMUM = 80,
}

export interface LocationFilter {
  readonly country?: string;
  readonly fullAddress: string;
  readonly latitude: number;
  readonly longitude: number;
}

export enum ProjectFilters {
  LANGUAGES = 'projectLanguages',
  LOCATION = 'projectLocation',
  SKILLS = 'projectSkills',
  TYPES = 'types',
  UPGRADES = 'projectUpgrades',
}

export enum ProjectSortingOptions {
  NEWEST_FIRST,
  BUDGET_LOW_TO_HIGH,
  BUDGET_HIGH_TO_LOW,
  BIDS_LOW_TO_HIGH,
  BIDS_HIGH_TO_LOW,
  OLDEST_FIRST,
}

export enum RatingFilterRange {
  MINIMUM = 1,
  MAXIMUM = 5,
}

export enum ReviewCountFilterRange {
  MINIMUM = 0,
  MAXIMUM = 500,
}

export enum SearchAnchor {
  TOP = 'top',
}

export enum SearchRequestStatus {
  CACHED = 'cached',
  EMPTY = 'empty',
  ERROR = 'error',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export enum SearchType {
  CONTESTS = 'contests',
  PROJECTS = 'projects',
  SHARED = 'shared',
  USERS = 'users',
}

export enum SharedFilters {
  QUERY = 'q',
}

export enum SortingOptionType {
  CONTESTS,
  PROJECTS,
  USERS,
}

export enum UserFilters {
  EXAMS = 'exams',
  HOURLY_RATE_MAX = 'hourlyRateMax',
  HOURLY_RATE_MIN = 'hourlyRateMin',
  LOCATION = 'userLocation',
  ONLINE = 'online',
  RATING = 'rating',
  REVIEW_COUNT_MAX = 'reviewCountMax',
  REVIEW_COUNT_MIN = 'reviewCountMin',
  SKILLS = 'userSkills',
}

export enum UserSortingOptions {
  MOST_RELEVANT,
  HOURLY_RATE_LOW_TO_HIGH,
  HOURLY_RATE_HIGH_TO_LOW,
}

export type SearchCollection =
  | SearchUsersCollection
  | SearchActiveProjectsCollection
  | SearchActiveContestsCollection;

export function getRequestStatus<T extends SearchCollection>(
  status: RequestStatus<T>,
  items?: ReadonlyArray<T['DocumentType']>,
): SearchRequestStatus {
  if (!status.ready && !status.error) {
    return SearchRequestStatus.LOADING;
  }

  if (!status.ready && status.error && (!items || items.length === 0)) {
    return SearchRequestStatus.ERROR;
  }

  if (!status.ready && status.error && items && items.length > 0) {
    return SearchRequestStatus.CACHED;
  }

  if (status.ready && !status.error && items?.length === 0) {
    return SearchRequestStatus.EMPTY;
  }

  return SearchRequestStatus.SUCCESS;
}
