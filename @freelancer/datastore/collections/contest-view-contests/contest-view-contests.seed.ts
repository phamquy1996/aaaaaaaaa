import {
  ContestStatusApi,
  ContestTypeApi,
  EntryFileFormatApi,
} from 'api-typings/contests/contests';
import { ContestUpgrade } from '../contests/contests.model';
import { generateContestObject } from '../contests/contests.seed';
import { CurrencyCode } from '../currencies/currencies.seed';
import { Skill } from '../skills/skills.model';
import { ContestViewContest } from './contest-view-contests.model';

export interface GenerateContestViewContestOptions {
  readonly ownerId: number;
  readonly contestId?: number;
  readonly type?: ContestTypeApi;
  readonly currencyCode?: CurrencyCode;
  readonly description?: string;
  readonly status?: ContestStatusApi;
  readonly skills?: ReadonlyArray<Skill>;
  readonly title?: string;
  readonly entryCount?: number;
  readonly duration?: number;
  readonly upgrades?: ContestUpgrade;
  readonly prize?: number;
}

export function generateContestViewContestObject(
  options: GenerateContestViewContestOptions,
): ContestViewContest {
  return {
    ...generateContestObject(options),
    ...generateContestViewContestDetails(options),
  };
}

function generateContestViewContestDetails(
  options: GenerateContestViewContestOptions,
) {
  return {
    usersInterested: 0,
    acceptedFileFormats: [
      EntryFileFormatApi.GIF,
      EntryFileFormatApi.JPEG,
      EntryFileFormatApi.JPG,
      EntryFileFormatApi.PNG,
    ],
    isPrizeAutodistributed: false,
  };
}
