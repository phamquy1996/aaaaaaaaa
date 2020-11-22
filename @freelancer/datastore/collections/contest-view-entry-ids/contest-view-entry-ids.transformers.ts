import { ContestViewEntryIdsAjax } from './contest-view-entry-ids.backend-model';
import { ContestViewEntryIds } from './contest-view-entry-ids.model';

export function transformContestViewEntryIds(
  contestViewEntryIds: ContestViewEntryIdsAjax,
): ContestViewEntryIds {
  return {
    id: `${contestViewEntryIds.contest_id}_${contestViewEntryIds.filter}_${contestViewEntryIds.sort}`,
    contestId: contestViewEntryIds.contest_id,
    entryIds: contestViewEntryIds.entry_ids,
    entryNumbers: contestViewEntryIds.entry_numbers,
    filter: contestViewEntryIds.filter,
    sort: contestViewEntryIds.sort,
    entryOwnerIds: contestViewEntryIds.entry_owner_ids ?? undefined,
  };
}
