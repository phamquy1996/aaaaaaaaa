/**
 * Used in CVP for navigating on entry quickview (next/previous). We need the
 * list of all entry IDs for the selected contest in order to correctly navigate
 * the quickview modal.
 */
export interface ContestViewEntryIds {
  readonly id: string;
  readonly contestId: number;
  readonly entryIds: ReadonlyArray<number>;
  readonly entryNumbers: ReadonlyArray<number>;
  readonly filter: EntryIdFilterOption;
  readonly sort: EntryIdSortOption;
  readonly entryOwnerIds?: ReadonlyArray<number>;
}

export enum EntryIdFilterOption {
  ACTIVE = 'ACTIVE',
  TOP = 'TOP',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  NO_FEEDBACK = 'NO_FEEDBACK',
  DEFAULT = 'DEFAULT',
}

export enum EntryIdSortOption {
  RATING = 'RATING',
  TIME_SUBMITTED = 'TIME_SUBMITTED',
  LIKES = 'LIKES',
  FREELANCER_RATING = 'FREELANCER_RATING',
  DEFAULT = 'DEFAULT',
}
