import { ContestEntry } from '../contest-entries';
import {
  ContestViewEntryIds,
  EntryIdFilterOption,
  EntryIdSortOption,
} from './contest-view-entry-ids.model';

export interface GenerateContestViewEntryIdsOptions {
  readonly contestId: number;
  readonly entryIds: ReadonlyArray<number>;
  readonly entryOwnerIds: ReadonlyArray<number>;
  readonly entryNumbers?: ReadonlyArray<number>;
  readonly filter?: EntryIdFilterOption;
  readonly sort?: EntryIdSortOption;
}

export function generateContestViewEntryIdsObject({
  contestId,
  entryIds,
  entryOwnerIds,
  entryNumbers = entryIds.map((_, index) => index + 1),
  filter = EntryIdFilterOption.DEFAULT,
  sort = EntryIdSortOption.DEFAULT,
}: GenerateContestViewEntryIdsOptions): ContestViewEntryIds {
  return {
    id: `${contestId}_${filter}_${sort}`, // from transformer
    contestId,
    entryIds,
    entryOwnerIds,
    entryNumbers,
    filter,
    sort,
  };
}

// --- Mixins ---
export function withEntriesForContestViewEntryIds(
  entries: ReadonlyArray<ContestEntry>,
): Pick<GenerateContestViewEntryIdsOptions, 'entryIds' | 'entryOwnerIds'> {
  return {
    entryIds: entries.map(entry => entry.id),
    entryOwnerIds: entries.map(entry => entry.ownerId),
  };
}
