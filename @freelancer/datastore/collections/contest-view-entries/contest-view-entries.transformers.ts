import {
  EntriesSortApi,
  EntryApi,
  EntryFileApi,
  EntryStatusApi,
} from 'api-typings/contests/contests';
import { transformContestEntry } from '../contest-entries/contest-entries.transformers';
import {
  ContestEntryFile,
  ContestEntryHasFeedbackStatus,
  ContestViewEntry,
} from './contest-view-entries.model';

/**
 * Typescript enums generated from Thrift enums by API-typings do not retain
 * the numeric values and instead maps the keys to their string equivalent.
 * We manually re-create the mapping here because we need the numeric values
 * for sorting.
 */
const entryStatusStringToNumberMapping: Map<EntryStatusApi, number> = new Map([
  [EntryStatusApi.PENDING, 0],
  [EntryStatusApi.WITHDRAWN, 1],
  [EntryStatusApi.WITHDRAWN_ELIMINATED, 2],
  [EntryStatusApi.ELIMINATED, 3],
  [EntryStatusApi.ACTIVE, 4],
  [EntryStatusApi.WON, 5],
  [EntryStatusApi.WON_CLOSED, 6],
  [EntryStatusApi.WON_RUNNER_UP, 7],
  [EntryStatusApi.WON_BRONZE, 8],
  [EntryStatusApi.WON_SILVER, 9],
  [EntryStatusApi.CHOSEN, 10],
  [EntryStatusApi.WON_GOLD, 11],
  [EntryStatusApi.DRAFT, 12],
  [EntryStatusApi.BOUGHT, 13],
]);

export function mapStatusTextToNumber(statusText: EntryStatusApi): number {
  const statusCode = entryStatusStringToNumberMapping.get(statusText);
  return statusCode !== undefined ? statusCode : 0;
}

function mapHasFeedbackBoolToEnum(
  hasFeedback?: boolean,
): ContestEntryHasFeedbackStatus {
  switch (hasFeedback) {
    case true:
      return ContestEntryHasFeedbackStatus.YES;
    case false:
      return ContestEntryHasFeedbackStatus.NO;
    default:
      return ContestEntryHasFeedbackStatus.UNKNOWN;
  }
}

export function transformContestViewEntry(entry: EntryApi): ContestViewEntry {
  return {
    ...transformContestEntry(entry),
    commentCount: 0, // FIXME: needs T75373 to be finished
    isLiked: entry.is_liked || false,
    sellPrice: entry.sell_price,
    files: entry.files ? entry.files.map(transformContestEntryFile) : [],
    upgrades: entry.upgrades,
    seoUrl: entry.seo_url.replace(/\.html$/, ''),
    statusNumber: mapStatusTextToNumber(entry.status),
    hasFeedback: mapHasFeedbackBoolToEnum(entry.has_feedback),
    // The properties below are made required for sorting the DS collection
    rating: entry.rating ? entry.rating : 0,
    likeCount: entry.like_count ? entry.like_count : 0,
    freelancerRating: entry.freelancer_rating ? entry.freelancer_rating : 0,
  };
}

export function transformContestEntryFile(
  file: EntryFileApi,
): ContestEntryFile {
  if (!file.id || !file.name) {
    throw new ReferenceError(
      `Contest entry file has missing properties: ${file}`,
    );
  }

  return {
    id: file.id,
    name: file.name,
    fileUrl: file.file_url,
    thumbnailUrl: file.thumbnail_url,
    thumbnail420Url: file.thumbnail_420_url,
    thumbnail900Url: file.thumbnail_900_url,
    thumbnail80Url: file.thumbnail_80_url,
    thumbnail80FixUrl: file.thumbnail_80_fix_url,
    thumbnailDigestUrl: file.thumbnail_digest_url,
    thumbnailPreview: file.thumbnail_preview,
  };
}

export function transformEntryFileApi(file: ContestEntryFile): EntryFileApi {
  if (!file.id || !file.name) {
    throw new ReferenceError(`Entry file api has missing properties: ${file}`);
  }

  return {
    id: file.id,
    name: file.name,
    file_url: file.fileUrl,
    thumbnail_url: file.thumbnailUrl,
    thumbnail_420_url: file.thumbnail420Url,
    thumbnail_900_url: file.thumbnail900Url,
    thumbnail_80_url: file.thumbnail80Url,
    thumbnail_80_fix_url: file.thumbnail80FixUrl,
    thumbnail_digest_url: file.thumbnailDigestUrl,
    thumbnail_preview: file.thumbnailPreview,
  };
}

export function transformEntriesSortApi(
  entrySort: string,
): EntriesSortApi | undefined {
  switch (entrySort) {
    case 'rating':
      return EntriesSortApi.RATING;
    case 'number':
      return EntriesSortApi.NUMBER;
    case 'likeCount':
      return EntriesSortApi.NUM_LIKES;
    case 'freelancerRating':
      return EntriesSortApi.FREELANCER_RATING;
    default:
      return undefined;
  }
}

export function transformEntryHasFeedbackApi(
  hasFeedback: ContestEntryHasFeedbackStatus,
): boolean | undefined {
  switch (hasFeedback) {
    case ContestEntryHasFeedbackStatus.YES:
      return true;
    case ContestEntryHasFeedbackStatus.NO:
      return false;
    default:
      return undefined;
  }
}
