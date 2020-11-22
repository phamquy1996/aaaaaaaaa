import { generateId } from '@freelancer/datastore/testing';
import {
  ContestStatusApi,
  ContestTypeApi,
} from 'api-typings/contests/contests';
import { ContestEntry } from '../contest-entries/contest-entries.model';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { Skill } from '../skills/skills.model';
import { phpSkill } from '../skills/skills.seed';
import { Contest, ContestUpgrade } from './contests.model';

export interface GenerateContestOptions {
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

/**
 * Returns a contest object. By default, this is a contest that is "Active".
 */
export function generateContestObject({
  ownerId,
  contestId,
  type = ContestTypeApi.REGULAR,
  currencyCode = CurrencyCode.USD,
  description = 'A contest description',
  status = ContestStatusApi.ACTIVE,
  skills = [phpSkill()],
  title = 'A contest title',
  entryCount = 0,
  duration = 7,
  upgrades = {
    guaranteed: false,
    featured: false,
    topContest: false,
    highlight: false,
    sealed: false,
    nda: false,
    private: false,
    urgent: false,
  },
  prize = 100,
}: GenerateContestOptions): Contest {
  const id = contestId !== undefined ? contestId : generateId();
  const now = Date.now();

  return {
    id,
    currency: generateCurrencyObject(currencyCode),
    description,
    skills,
    ownerId,
    seoUrl: `contest/${id}`,
    status,
    title,
    type,
    timeSubmitted: now,
    timePosted: now,
    timeEnded: now + duration * 24 * 60 * 60 * 1000,
    timeSigned: undefined,
    entryCount,
    duration,
    upgrades,
    prize,
    draft: status === ContestStatusApi.INACTIVE, // from transformer
    fileIds: undefined, // TODO
    enterpriseId: undefined, // TODO
  };
}

// --- Mixins ---
export function withEntries(
  entries: ReadonlyArray<ContestEntry>,
): Pick<GenerateContestOptions, 'entryCount'> {
  return {
    entryCount: entries.length,
  };
}
