import { ContestViewEntry } from '../contest-view-entries/contest-view-entries.model';
import {
  ContestEntryStockItem,
  ContestQuickviewEntry,
} from './contest-quickview-entries.model';

export interface GenerateContestQuickviewEntriesOptions {
  readonly contestViewEntries: ReadonlyArray<ContestViewEntry>;
  readonly stockItems?: ReadonlyArray<ContestEntryStockItem>;
}

export function generateContestQuickviewEntryObjects({
  contestViewEntries,
  stockItems = [],
}: GenerateContestQuickviewEntriesOptions): ReadonlyArray<
  ContestQuickviewEntry
> {
  return contestViewEntries.map(contestViewEntry => ({
    ...contestViewEntry,
    stockItems,
  }));
}

// --- Mixins ---
