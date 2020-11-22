import {
  ContestBudgetRange,
  ContestViewContest,
} from '@freelancer/datastore/collections';

export enum QuickviewModalResponse {
  AWARD,
  BUY,
  REPORT,
  MAKE_OFFER,
  VIEW_ALL_ENTRIES_BY_ENTRANT,
}

export interface QuickviewModalDetails {
  readonly contest: ContestViewContest;
  readonly isContestOwner: boolean;
  readonly hasContestAwardedEntry: boolean;
  readonly initialEntryId: number;
  readonly entryIds?: ReadonlyArray<number>;
  readonly isOnMultiAward: boolean;
  readonly canMultiAward: boolean;
  readonly contestBudgetRange: ContestBudgetRange;
  readonly initialFileIndex: number;
}
