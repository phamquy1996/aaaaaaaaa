import { toNumber } from '@freelancer/utils';
import { UserRecentProjectsAndContestsEntryAjax } from './user-recent-projects-and-contests.backend-model';
import { UserRecentProjectsAndContestsEntry } from './user-recent-projects-and-contests.model';

export function transformUserRecentProjectsAndContests(
  listItem: UserRecentProjectsAndContestsEntryAjax,
): UserRecentProjectsAndContestsEntry {
  return {
    id: `${listItem.type}-${listItem.id}`,
    type: listItem.type,
    latest: listItem.latest,
    name: listItem.name,
    projectOrContestId: toNumber(listItem.id),
    urlPart: listItem.urlPart,
  };
}
