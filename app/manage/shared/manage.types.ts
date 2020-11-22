import {
  ContestEntriesCollection,
  ContestsCollection,
  ManageViewContestHandoversCollection,
  ManageViewContestsCollection,
  ManageViewHandoversCollection,
  ManageViewOngoingBidsCollection,
  ManageViewOngoingProjectsCollection,
  ManageViewOpenBidsCollection,
  ManageViewOpenProjectsCollection,
  ManageViewPastBidsCollection,
  ManageViewPastProjectsCollection,
} from '@freelancer/datastore/collections';

export enum ManageTableType {
  CONTEST = 'contest',
  PROJECT = 'project',
  HANDOVER = 'handover',
}

export enum ManageTableView {
  OPEN = 'open',
  ONGOING = 'ongoing',
  PAST = 'past',
}

export enum ManageViewType {
  EMPLOYER = 'employer',
  FREELANCER = 'freelancer',
}

export type ManageCollectionType =
  | ContestEntriesCollection
  | ContestsCollection
  | ManageViewContestHandoversCollection
  | ManageViewContestsCollection
  | ManageViewHandoversCollection
  | ManageViewOpenBidsCollection
  | ManageViewOngoingBidsCollection
  | ManageViewPastBidsCollection
  | ManageViewOpenProjectsCollection
  | ManageViewOngoingProjectsCollection
  | ManageViewPastProjectsCollection;

export enum ManageProjectFilter {
  ALL = 'All',
  RECRUITER = 'Recruiter',
}

export const manageProjectFilterOptions: ReadonlyArray<ManageProjectFilter> = [
  ManageProjectFilter.ALL,
  ManageProjectFilter.RECRUITER,
];

export const itemsPerPageOptions: ReadonlyArray<string> = [
  '10',
  '20',
  '50',
  '100',
];

export interface ManageSearchFilter {
  readonly query: string;
  readonly filter?: ManageProjectFilter;
}

export const defaultProjectSearchFilter = {
  query: '',
  filter: ManageProjectFilter.ALL,
};

export const defaultContestSearchFilter = {
  query: '',
};

export const INIT_ITEMS_PER_PAGE = 10;
export const PAGES_TO_REQUEST = 10;
export const PAGES_TO_LOOK_AHEAD = 3;
export const MANAGE_TABLE_ANCHOR = 'manageTop';
export const SEARCH_DEBOUNCE_TIME = 700;
