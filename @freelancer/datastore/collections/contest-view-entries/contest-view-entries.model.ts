import {
  EntryStatusApi,
  EntryUpgradesApi,
} from 'api-typings/contests/contests';
import { ContestEntry } from '../contest-entries/contest-entries.model';

/**
 * Contest entries model used in the contest view page.
 */
export interface ContestViewEntry extends ContestEntry {
  readonly commentCount: number;
  readonly sellPrice?: number;
  readonly isLiked: boolean;
  readonly upgrades?: EntryUpgradesApi;
  readonly files: ReadonlyArray<ContestEntryFile>;
  readonly seoUrl: string;
  readonly statusNumber: number; // Numeric value of the status from the Thrift API-typings
  readonly hasFeedback: ContestEntryHasFeedbackStatus;
  // The properties below are made required for sorting the DS collection
  readonly rating: number;
  readonly likeCount: number;
  readonly freelancerRating: number;
}

export interface ContestEntryFile {
  readonly id: number;
  readonly name: string;
  readonly fileUrl?: string;
  readonly thumbnailUrl?: string;
  readonly thumbnail420Url?: string;
  readonly thumbnail900Url?: string;
  readonly thumbnail80Url?: string;
  readonly thumbnail80FixUrl?: string;
  readonly thumbnailDigestUrl?: string;
  readonly thumbnailPreview?: string;
}

/**
 * Used on server notifications model since entry-related websocket events
 * sends the status as a text.
 */
export enum ContestEntryStatusWebsocketEvent {
  WON = 'Won',
  BOUGHT = 'Bought',
  ELIMINATED = 'Eliminated',
  ACTIVE = 'Active',
  WITHDRAWN = 'Withdrawn',
}

export const CONTEST_ENTRY_TEXT_FORMATS: ReadonlyArray<string> = ['pdf'];

export const CONTEST_ENTRY_AWARD_STATUSES: ReadonlyArray<EntryStatusApi> = [
  EntryStatusApi.WON,
  EntryStatusApi.WON_CLOSED,
  EntryStatusApi.WON_RUNNER_UP,
  EntryStatusApi.WON_BRONZE,
  EntryStatusApi.WON_SILVER,
  EntryStatusApi.WON_GOLD,
  EntryStatusApi.CHOSEN,
];

/** Set of contest entry statuses allowed to be shown in CVP */
export const VISIBLE_ENTRIES_DEFAULT_FILTER: ReadonlyArray<EntryStatusApi> = [
  EntryStatusApi.WITHDRAWN,
  EntryStatusApi.WITHDRAWN_ELIMINATED,
  EntryStatusApi.ELIMINATED,
  EntryStatusApi.ACTIVE,
  EntryStatusApi.BOUGHT,
  ...CONTEST_ENTRY_AWARD_STATUSES,
];

export enum ContestEntryFileType {
  IMAGE,
  VIDEO,
  TEXT,
}

export enum ContestEntryHasFeedbackStatus {
  YES = 'yes',
  NO = 'no',
  UNKNOWN = 'unknown',
}
