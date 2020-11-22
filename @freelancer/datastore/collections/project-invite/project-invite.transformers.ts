import { ProjectInviteApi } from 'api-typings/projects/projects';
import { ProjectInvite } from './project-invite.model';

export function transformProjectInvite(
  projectInvite: ProjectInviteApi,
): ProjectInvite {
  return {
    id: Date.now(), // The Id here doesn't matter as this is a push-only collection,
    freelancerId: projectInvite.freelancer_id,
    projectId: projectInvite.project_id,
    message: projectInvite.message,
  };
}
