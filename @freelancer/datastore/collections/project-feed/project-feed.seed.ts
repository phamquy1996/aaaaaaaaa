import { generateId } from '@freelancer/datastore/testing';
import { CurrencyCode } from '../currencies/currencies.seed';
import { Skill } from '../skills/skills.model';
import { graphicDesignSkill, phpSkill } from '../skills/skills.seed';
import {
  ContestEntryType,
  ProjectEntryType,
  ProjectFeedContestEntry,
  ProjectFeedEntry,
  ProjectFeedProjectEntry,
} from './project-feed.model';

export interface GenerateProjectFeedOptions {
  readonly projectEntries?: ReadonlyArray<
    GenerateProjectFeedProjectEntryOptions
  >;
  readonly contestEntries?: ReadonlyArray<
    GenerateProjectFeedContestEntryOptions
  >;
}

export interface GenerateProjectFeedProjectEntryOptions {
  readonly currencyCode?: CurrencyCode;
  readonly description?: string;
  readonly freeBidUntil?: number;
  readonly fulltime?: boolean;
  readonly hideBids?: boolean;
  readonly imgUrl?: string;
  readonly linkUrl?: string;
  readonly maxBudget?: number;
  readonly minBudget?: number;
  readonly recruiter?: boolean;
  readonly skills?: ReadonlyArray<Skill>;
  readonly time?: number;
  readonly title?: string;
  readonly type?: ProjectEntryType;
}

export interface GenerateProjectFeedContestEntryOptions {
  readonly currencyCode?: string;
  readonly description?: string;
  readonly freeBidUntil?: number;
  readonly id?: string;
  readonly imgUrl?: string;
  readonly linkUrl?: string;
  readonly maxBudget?: number;
  readonly minBudget?: number;
  readonly skills?: ReadonlyArray<Skill>;
  readonly time?: number;
  readonly title?: string;
  readonly type?: ContestEntryType;
  readonly userId?: number;
}

export function projectFeedProjectEntriesFromSkills(
  skills: ReadonlyArray<Skill>,
): Pick<GenerateProjectFeedOptions, 'projectEntries'> {
  return {
    projectEntries: skills.map(skill => ({ skills: [skill] })),
  };
}

function generateProjectFeedProjectEntry({
  currencyCode = CurrencyCode.USD,
  description = 'test description',
  freeBidUntil,
  fulltime = false,
  hideBids = false,
  imgUrl = 'https://www.freelancer.com',
  linkUrl = 'https://www.freelancer.com',
  maxBudget = 250,
  minBudget = 750,
  recruiter = false,
  skills = [phpSkill(), graphicDesignSkill()],
  time = Date.now(),
  title = `Test Project - ${Date.now()}`,
  type = 'project',
}: GenerateProjectFeedProjectEntryOptions): ProjectFeedProjectEntry {
  const userId = generateId();

  return {
    currencyCode,
    description,
    freeBidUntil,
    fulltime,
    hideBids,
    id: generateId().toString(),
    imgUrl,
    jobIds: skills.map(skill => skill.id),
    jobString: skills.map(skill => skill.name).join(','),
    linkUrl,
    maxBudget,
    minBudget,
    publicName: undefined,
    recruiter,
    time,
    title,
    type,
    userId,
    username: `testUsername${userId}`,
  };
}

function generateProjectFeedContestEntry({
  currencyCode = CurrencyCode.USD,
  description = 'test description',
  freeBidUntil,
  imgUrl = 'https://www.freelancer.com',
  linkUrl = 'https://www.freelancer.com',
  maxBudget = 250,
  minBudget = 750,
  skills = [phpSkill(), graphicDesignSkill()],
  time = Date.now(),
  title = `Test Project - ${Date.now()}`,
  type = 'contest',
}: GenerateProjectFeedContestEntryOptions): ProjectFeedContestEntry {
  const userId = generateId();

  return {
    currencyCode,
    description,
    freeBidUntil,
    id: generateId().toString(),
    imgUrl,
    jobIds: skills.map(skill => skill.id),
    jobString: skills.map(skill => skill.name).join(','),
    linkUrl,
    maxBudget,
    minBudget,
    time,
    title,
    type,
    userId,
    username: `testUsername${userId}`,
  };
}

export function generateProjectFeedObjects({
  projectEntries = [],
  contestEntries = [],
}: GenerateProjectFeedOptions): ReadonlyArray<ProjectFeedEntry> {
  return [
    ...projectEntries.map(projectEntry =>
      generateProjectFeedProjectEntry(projectEntry),
    ),

    ...contestEntries.map(contestEntry =>
      generateProjectFeedContestEntry(contestEntry),
    ),
  ];
}
