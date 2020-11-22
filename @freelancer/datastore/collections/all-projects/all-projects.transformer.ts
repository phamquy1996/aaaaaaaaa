import { ProjectApi } from 'api-typings/projects/projects';
import { transformProject } from '../projects/projects.transformers';
import { AllProjects, AllProjectsContext } from './all-projects.model';

export function transformAllProjects(
  project: ProjectApi,
  context: AllProjectsContext,
): AllProjects {
  return {
    ...transformProject(project),
    bidAwardStatus: context.bidAwardStatus,
    bidCompleteStatus: context.bidCompleteStatus,
    unlistedProjects: context.unlistedProjects,
    searchProjectStatus: context.searchProjectStatus,
  };
}
