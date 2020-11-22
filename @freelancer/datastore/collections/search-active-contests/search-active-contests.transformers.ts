import { transformUpgradeType, UpgradeType } from '@freelancer/ui/upgrade-tag';
import { isDefined } from '@freelancer/utils';
import { ContestApi } from 'api-typings/contests/contests';
import { ContestUpgrade } from '../contests/contests.model';
import {
  transformContest,
  transformContestUpgrades,
} from '../contests/contests.transformers';
import { SearchActiveContest } from './search-active-contests.model';

export function transformSearchActiveContest(
  contest: ContestApi,
): SearchActiveContest {
  if (!contest.jobs || !contest.type || !contest.upgrades) {
    throw new ReferenceError(`Missing a required contest entry field.`);
  }
  return {
    ...transformContest(contest),
    skillIds: contest.jobs.map(job => job.id),
    upgradeNames: transformUpgradeNames(
      transformContestUpgrades(contest.type, contest.upgrades),
    ),
  };
}

export function transformUpgradeNames(
  upgrades: ContestUpgrade,
): ReadonlyArray<UpgradeType> {
  return Object.entries(upgrades)
    .filter(([_, value]) => value)
    .map(([upgrade, _]) => transformUpgradeType(upgrade))
    .filter(isDefined);
}
