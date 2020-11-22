import { transformUpgradeType, UpgradeType } from '@freelancer/ui/upgrade-tag';
import { isDefined } from '@freelancer/utils';
import { FrontendProjectStatusApi } from 'api-typings/common/common';
import { ProjectApi } from 'api-typings/projects/projects';
import { ProjectUpgrades } from '../projects/projects.model';
import {
  transformProject,
  transformProjectUpgrades,
} from '../projects/projects.transformers';
import { transformSkill } from '../skills/skills.transformers';
import { transformLocation } from '../users/users-location.transformers';
import { SearchActiveProject } from './search-active-projects.model';

export function transformSearchActiveProject(
  project: ProjectApi,
): SearchActiveProject {
  if (
    !project.bidperiod ||
    !project.description ||
    !project.jobs ||
    !project.location ||
    !project.time_submitted ||
    !project.upgrades
  ) {
    throw new ReferenceError(`Missing a required project entry field.`);
  }

  // Active Projects = Open Projects
  if (project.frontend_project_status !== FrontendProjectStatusApi.OPEN) {
    throw new ReferenceError(
      `Invalid status for project in active project search`,
    );
  }

  const location = transformLocation(project.location);

  return {
    ...transformProject(project),
    bidTimeLeft: transformBidTimeLeft(
      project.bidperiod,
      project.time_submitted,
    ),
    country: location.country,
    description: project.description,
    searchCoordinates: location.mapCoordinates,
    skillIds: project.jobs.map(job => job.id),
    skills: project.jobs.map(transformSkill),
    upgradeNames: transformUpgradeNames(
      transformProjectUpgrades(project.upgrades),
    ),
  };
}

export function transformBidTimeLeft(
  bidPeriod: number,
  timeSubmitted: number,
): number {
  const DAY_IN_MILLISECONDS = 86400000;
  return timeSubmitted * 1000 + bidPeriod * DAY_IN_MILLISECONDS;
}

export function transformUpgradeNames(
  upgrades: ProjectUpgrades,
): ReadonlyArray<UpgradeType> {
  return Object.entries(upgrades)
    .filter(([_, value]) => value)
    .map(([upgrade, _]) => transformUpgradeType(upgrade))
    .filter(isDefined);
}
