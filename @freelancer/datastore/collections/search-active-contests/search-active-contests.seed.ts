import { generateId } from '@freelancer/datastore/testing';
import { UpgradeType } from '@freelancer/ui/upgrade-tag';
import {
  ContestStatusApi,
  ContestTypeApi,
} from 'api-typings/contests/contests';
import {
  generateContestObject,
  GenerateContestOptions,
} from '../contests/contests.seed';
import { CurrencyCode } from '../currencies/currencies.seed';
import { generateSkillObjects, phpSkill } from '../skills/skills.seed';
import { SearchActiveContest } from './search-active-contests.model';

export interface GenerateSearchActiveContestOptions
  extends GenerateContestOptions {
  readonly skillCount?: number;
  readonly upgradeNames?: ReadonlyArray<UpgradeType>;
}

export function generateSearchActiveContestObject({
  contestId,
  currencyCode = CurrencyCode.USD,
  description = 'A contest description',
  duration = 7,
  entryCount,
  ownerId,
  prize = 100,
  skillCount = 1,
  skills = [phpSkill()],
  status = ContestStatusApi.ACTIVE,
  title = 'A sample contest title',
  type = ContestTypeApi.REGULAR,
  upgradeNames = [],
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
}: GenerateSearchActiveContestOptions): SearchActiveContest {
  const id = contestId ?? generateId();
  const generatedSkills =
    skills.length > 1
      ? skills
      : generateSkillObjects().slice(0, skillCount > 0 ? skillCount : 1);
  const generatedContestOptions = generateContestObject({
    ownerId,
    contestId: id,
    type,
    currencyCode,
    description,
    status,
    skills: generatedSkills,
    title,
    entryCount,
    duration,
    upgrades,
    prize,
  });

  return {
    ...generatedContestOptions,
    skillIds: generatedSkills.map(skill => skill.id),
    upgradeNames,
  };
}
