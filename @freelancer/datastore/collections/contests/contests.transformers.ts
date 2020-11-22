import {
  ContestApi,
  ContestStatusApi,
  ContestTypeApi,
  ContestUpgradesApi,
} from 'api-typings/contests/contests';
import { transformCurrency } from '../currencies/currencies.transformers';
import { transformSkill } from '../skills/skills.transformers';
import { Contest, ContestUpgrade } from './contests.model';

export function transformContest(contest: ContestApi): Contest {
  if (
    !contest.currency ||
    !contest.owner_id ||
    !contest.seo_url ||
    !contest.status ||
    !contest.type
  ) {
    throw new ReferenceError(`Missing a required contest field.`);
  }

  return {
    id: contest.id,
    currency: transformCurrency(contest.currency),
    description: contest.description || '',
    skills: (contest.jobs || []).map(transformSkill),
    ownerId: contest.owner_id,
    seoUrl: contest.seo_url_new
      ? contest.seo_url_new
          // FIXME: T185222
          // The seo url from contest_create API endpoint contains a
          // leading slash and is inconsistent with the seo url from contests_get.
          // We'll fix the seo url here for now
          .replace(/^\//, '')
      : '',
    status: contest.status,
    title: contest.title || '',
    type: contest.type,
    timeSubmitted: contest.time_submitted
      ? contest.time_submitted * 1000
      : undefined,
    timePosted: contest.time_posted ? contest.time_posted * 1000 : undefined,
    timeEnded: contest.time_ended ? contest.time_ended * 1000 : undefined,
    timeSigned: contest.time_signed ? contest.time_signed * 1000 : undefined,
    upgrades: transformContestUpgrades(contest.type, contest.upgrades),
    entryCount: contest.entry_count,
    duration: contest.duration,
    prize: contest.prize,
    draft: contest.status === ContestStatusApi.INACTIVE,
    enterpriseId: contest.enterprise_id,
  };
}

export function transformContestUpgrades(
  type: ContestTypeApi,
  upgrades: ContestUpgradesApi | undefined,
): ContestUpgrade {
  return {
    featured: upgrades?.featured || false,
    guaranteed: type === ContestTypeApi.GUARANTEED || false,
    highlight: upgrades?.highlighted || false,
    nda: upgrades?.nda || false,
    private: upgrades?.nonpublic || false,
    sealed: upgrades?.sealed || false,
    topContest: upgrades?.topcontest || false,
    urgent: upgrades?.urgent || false,
  };
}
