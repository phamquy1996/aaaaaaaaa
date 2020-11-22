import { isDefined } from '@freelancer/utils';
import { ProjectApi } from 'api-typings/projects/projects';
import { transformProject } from '../projects/projects.transformers';
import { transformSkill } from '../skills/skills.transformers';
import { ThreadProject } from './thread-projects.model';

export function transformThreadProject(projectApi: ProjectApi): ThreadProject {
  return {
    ...transformProject(projectApi),
    skills: isDefined(projectApi.jobs)
      ? projectApi.jobs.map(transformSkill)
      : [],
  };
}
