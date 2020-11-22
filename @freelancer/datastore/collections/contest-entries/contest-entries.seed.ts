import {
  generateId,
  generateNumbersInRangeWithDuplicates,
  getNovelLine,
  getRandomText,
} from '@freelancer/datastore/testing';
import { EntryStatusApi } from 'api-typings/contests/contests';
import { ContestEntry } from './contest-entries.model';

export interface GenerateContestEntriesOptions {
  readonly freelancerIds: ReadonlyArray<number>;
  readonly contestId: number;
  readonly contestOwnerId: number;
  readonly contestPrize?: number;

  // These are user IDs
  // They map one-to-one to entry.status, so only one will be applied.
  readonly activeIds?: ReadonlyArray<number>;
  readonly pendingIds?: ReadonlyArray<number>;
  readonly withdrawnIds?: ReadonlyArray<number>;
  readonly eliminatedIds?: ReadonlyArray<number>;
  readonly chosenIds?: ReadonlyArray<number>;
  readonly wonIds?: ReadonlyArray<number>;
  readonly boughtIds?: ReadonlyArray<number>;

  readonly minSellPrice?: number;
  readonly maxSellPrice?: number;
  readonly minLikeCount?: number;
  readonly maxLikeCount?: number;
  readonly minRating?: number;
  readonly maxRating?: number;
}

export interface GenerateContestEntryOptions {
  readonly freelancerId: number;
  readonly contestId: number;
  readonly contestOwnerId: number;
  readonly entryNumber?: number;
  readonly description?: string;
  readonly likeCount?: number;
  readonly rating?: number;
  readonly sellPrice?: number;
  readonly status: EntryStatusApi;
  readonly title?: string;
  readonly timeEntered: number;
  readonly timeEliminated?: number;
  readonly timeWon?: number;
}

// TODO: files
export function generateContestEntryObjects({
  freelancerIds,
  contestId,
  contestOwnerId,
  contestPrize = 100,
  activeIds = freelancerIds, // by default, entries are active
  pendingIds = [],
  withdrawnIds = [],
  eliminatedIds = [],
  chosenIds = [],
  wonIds = [],
  boughtIds = [],
  minSellPrice = 1,
  maxSellPrice = contestPrize,
  minLikeCount = 0,
  maxLikeCount = 20,
  minRating, // by default, entries are unrated
  maxRating,
}: GenerateContestEntriesOptions): ReadonlyArray<ContestEntry> {
  const sellPrices = generateNumbersInRangeWithDuplicates(
    minSellPrice,
    maxSellPrice,
    freelancerIds.length,
    'sellPrices',
  );

  const likeCounts = generateNumbersInRangeWithDuplicates(
    minLikeCount,
    maxLikeCount,
    freelancerIds.length,
    'likeCounts',
  );

  let ratings: ReadonlyArray<number> = [];
  if (minRating || maxRating) {
    ratings = generateNumbersInRangeWithDuplicates(
      minRating ?? 1,
      maxRating ?? 5,
      freelancerIds.length,
      'entryRatings',
    );
  }

  const now = Date.now();

  return freelancerIds.map((freelancerId, index) =>
    generateContestEntryObject({
      freelancerId,
      contestId,
      contestOwnerId,
      entryNumber: index + 1,
      rating: ratings.length ? ratings[index] : undefined,
      sellPrice: sellPrices[index],
      likeCount: likeCounts[index],

      timeEntered: now,
      timeEliminated: undefined, // TODO
      timeWon: undefined, // TODO

      ...(activeIds.includes(freelancerId)
        ? { status: EntryStatusApi.ACTIVE }
        : pendingIds.includes(freelancerId)
        ? { status: EntryStatusApi.PENDING }
        : withdrawnIds.includes(freelancerId)
        ? { status: EntryStatusApi.WITHDRAWN }
        : eliminatedIds.includes(freelancerId)
        ? { status: EntryStatusApi.ELIMINATED }
        : chosenIds.includes(freelancerId)
        ? { status: EntryStatusApi.CHOSEN }
        : wonIds.includes(freelancerId)
        ? { status: EntryStatusApi.WON }
        : boughtIds.includes(freelancerId)
        ? { status: EntryStatusApi.BOUGHT }
        : { status: EntryStatusApi.ACTIVE }),
    }),
  );
}

export function generateContestEntryObject({
  freelancerId,
  contestId,
  contestOwnerId,
  description,
  entryNumber = 1,
  likeCount = 0,
  rating, // by default, entries are unrated
  sellPrice = 10,
  status,
  timeEntered,
  timeEliminated,
  timeWon,
  title,
}: GenerateContestEntryOptions): ContestEntry {
  return {
    id: generateId(),
    ownerId: freelancerId,
    contestId,
    contestOwnerId,
    number: entryNumber,
    title: title || getRandomText(0, 50),
    description: description || getNovelLine('prideAndPrejudice', entryNumber),
    rating,
    sellPrice,
    likeCount,
    status,
    timeEntered,
    timeEliminated,
    timeWon,
  };
}

// --- Mixins ---

export function activeEntry(): Pick<
  GenerateContestEntryOptions,
  'status' | 'timeEntered'
> {
  return {
    status: EntryStatusApi.ACTIVE,
    timeEntered: Date.now(),
  };
}

export function awardedEntry(): Pick<
  GenerateContestEntryOptions,
  'status' | 'timeEntered' | 'timeWon'
> {
  const now = Date.now();

  return {
    status: EntryStatusApi.WON,
    timeEntered: now,
    timeWon: now + 1800000, // Plus 30 minutes
  };
}

export function rejectedEntry(): Pick<
  GenerateContestEntryOptions,
  'status' | 'timeEntered' | 'timeEliminated'
> {
  const now = Date.now();

  return {
    status: EntryStatusApi.ELIMINATED,
    timeEntered: now,
    timeEliminated: now + 1800000, // Plus 30 minutes
  };
}
