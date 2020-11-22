import { ProjectCollaborationApi } from 'api-typings/projects/projects';

export type ProjectCollaborationApiResponse = ProjectCollaborationApi;

/**
 * Require at least one of email/username, and permission
 */
export interface ProjectCollaborationPostRawPayload {
  readonly email?: string;
  readonly userName?: string;
  readonly permissions: ProjectCollaborationPermission;
}

export interface ProjectCollaborationUpdatePayload {
  readonly action: ProjectCollaborationAction;
  /** Only applicable when action is update permissions */
  readonly permissions?: ProjectCollaborationPermission;
}

export enum ProjectCollaborationAction {
  REVOKE = 'revoke',
  UPDATE_PERMISSIONS = 'update_permissions',
}

/**
 * Should match with ProjectCollaborationPermissionApi
 * milestone view permission can't be touched
 */
export interface ProjectCollaborationPermission {
  readonly chat?: boolean;
  readonly bid_award?: boolean;
}
