import {
  SearchProjectsSelfContestApi,
  SearchProjectsSelfProjectApi,
} from './search-projects-self.backend-model';
import {
  SearchProjectsSelfContest,
  SearchProjectsSelfEntry,
  SearchProjectsSelfProject,
} from './search-projects-self.model';

// Checking nullability is present since SearchLegacy does not handle errors
// correctly.
// TODO: Fix in new Search
export function transformSearchProjectsSelfEntry(
  item:
    | {
        readonly type: 'project';
        readonly project: SearchProjectsSelfProjectApi;
      }
    | {
        readonly type: 'contest';
        readonly contest: SearchProjectsSelfContestApi;
      },
): SearchProjectsSelfEntry {
  return item.type === 'project'
    ? transformSearchProjectsSelfProject(item.project)
    : transformSearchProjectsSelfContest(item.contest);
}

export function transformSearchProjectsSelfProject(
  project: SearchProjectsSelfProjectApi,
): SearchProjectsSelfProject {
  return {
    type: 'project',
    id: project.id,
    ownerId: project.owner_id,
    title: project.title,
    description: project.description,
    projectType: project.type,
  };
}

export function transformSearchProjectsSelfContest(
  contest: SearchProjectsSelfContestApi,
): SearchProjectsSelfContest {
  return {
    type: 'contest',
    id: contest.id,
    ownerId: contest.owner_id,
    title: contest.title,
    description: contest.description,
  };
}
