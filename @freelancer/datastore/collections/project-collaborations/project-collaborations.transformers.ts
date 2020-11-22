import { ProjectCollaborationApi } from 'api-typings/projects/projects';
import { ProjectCollaboration } from './project-collaborations.model';

export function transformProjectCollaboration(
  projectCollaboration: ProjectCollaborationApi,
): ProjectCollaboration {
  if (
    !projectCollaboration.id ||
    !projectCollaboration.context_owner_id ||
    !projectCollaboration.context
  ) {
    throw new Error('Project Collaboration missing a required field!');
  }

  return {
    id: projectCollaboration.id,
    userId: projectCollaboration.user_id,
    context: projectCollaboration.context,
    contextOwnerId: projectCollaboration.context_owner_id,
    status: projectCollaboration.status,
    inviteToken: projectCollaboration.invite_token,
    permissions: projectCollaboration.permissions || [],
    timeCreated: projectCollaboration.time_created
      ? projectCollaboration.time_created * 1000
      : undefined,
    timeUpdated: projectCollaboration.time_updated
      ? projectCollaboration.time_updated * 1000
      : undefined,
    contestCollaborationPermissions:
      projectCollaboration.contest_collaboration_permissions,
    obscured_email_address: projectCollaboration.obscured_email_address,
  };
}
