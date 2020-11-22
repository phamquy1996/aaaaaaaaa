import { Project } from '../projects/projects.model';
import { UserRecentProjectsAndContestsEntry } from './user-recent-projects-and-contests.model';

export interface GenerateRecentProjectsAndContestsOptions {
  readonly projects: ReadonlyArray<Project>;
}

export function generateRecentProjectsAndContestsObjects({
  projects,
}: GenerateRecentProjectsAndContestsOptions): ReadonlyArray<
  UserRecentProjectsAndContestsEntry
> {
  return projects.map(({ id, title, seoUrl, timeSubmitted }) => ({
    id: `project-${id}`,
    type: 'project',
    latest: timeSubmitted,
    name: title,
    projectOrContestId: id,
    urlPart: `/projects/${seoUrl}`,
  }));
}
