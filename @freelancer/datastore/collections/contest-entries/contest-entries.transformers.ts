import { EntryApi } from 'api-typings/contests/contests';
import { ContestEntry } from './contest-entries.model';

export function transformContestEntry(entry: EntryApi): ContestEntry {
  return {
    id: entry.id,
    contestId: entry.contest_id,
    contestOwnerId: entry.contest_owner_id,
    ownerId: entry.owner_id,
    status: entry.status,
    number: entry.number,
    title: entry.title,
    description: entry.description,
    rating: entry.rating,
    timeEntered: entry.time_entered ? entry.time_entered * 1000 : undefined,
    timeEliminated: entry.time_eliminated
      ? entry.time_eliminated * 1000
      : undefined,
    timeWon: entry.time_won ? entry.time_won * 1000 : undefined,
    deleted: entry.deleted,
    likeCount: entry.like_count,
    thumb:
      entry.files && entry.files[0] && entry.files[0].thumbnail_420_url
        ? entry.files[0].thumbnail_420_url
        : undefined,
    sellPrice: entry.sell_price,
  };
}
