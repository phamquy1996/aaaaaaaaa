import { toNumber } from '@freelancer/utils';
import { transformCurrencyAjax } from '../currencies/currencies.transformers';
import { SearchContestEntryAjax } from './search-contests.backend-model';
import { SearchContestEntry } from './search-contests.model';

function transformOneZero(value: '0' | '1' | 0 | 1 | null): boolean {
  return value === 1 || value === '1';
}

export function transformSearchContest(
  contest: SearchContestEntryAjax,
): SearchContestEntry {
  return {
    bidAvgUsd: contest.bid_avg_usd,
    bidCount: contest.bid_count,
    bidEndDate: contest.bid_enddate,
    contestType: toNumber(contest.contest_type),
    country: contest.country,
    currency: transformCurrencyAjax(contest.currency),
    entryType: contest.entry_type,
    extended: transformOneZero(contest.extended),
    featured: transformOneZero(contest.featured),
    hideBids: transformOneZero(contest.hidebids),
    highlight: transformOneZero(contest.highlight),
    id: contest.id,
    language: contest.language,
    maxBudget: contest.maxbudget,
    maxBudgetUsd: contest.maxbudget_usd,
    minBudget: contest.minbudget,
    minBudgetUsd: contest.minbudget_usd,
    name: contest.name,
    nda: contest.NDA === 'Y',
    neglected: transformOneZero(contest.neglected),
    nonpublic: transformOneZero(contest.nonpublic),
    prize: contest.prize,
    projectDesc: contest.project_desc,
    projectId: contest.project_id,
    projectName: contest.project_name,
    projectType: contest.project_type,
    skill: contest.skill,
    skills: contest.skills.map(skill => toNumber(skill)),
    state: toNumber(contest.state),
    status: toNumber(contest.status),
    submitDate: contest.submitdate,
    usersId: toNumber(contest.users_id),
  };
}
