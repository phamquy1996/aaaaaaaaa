import { generateId } from '@freelancer/datastore/testing';
import { ContextTypeApi } from 'api-typings/common/common';
import {
  ProjectCollaborationPermissionApi,
  ProjectCollaborationStatusApi,
} from 'api-typings/projects/projects';
import { GenerateProjectOptions } from '../projects/projects.seed';
import { ProjectCollaboration } from './project-collaborations.model';

export interface GenerateProjectCollaborationsOptions {
  readonly userIds: ReadonlyArray<number>;
  readonly projectId: number;
  readonly projectOwnerId: number;
  readonly status?: ProjectCollaborationStatusApi;
}

export interface GenerateProjectCollaborationOptions {
  readonly userId: number;
  readonly projectId: number;
  readonly projectOwnerId: number;
  readonly status?: ProjectCollaborationStatusApi;
}

export function generateProjectCollaborationObjects({
  userIds,
  projectOwnerId,
  projectId,
  status = ProjectCollaborationStatusApi.ACTIVE,
}: GenerateProjectCollaborationsOptions): ReadonlyArray<ProjectCollaboration> {
  return userIds.map(userId =>
    generateProjectCollaborationObject({
      userId,
      projectOwnerId,
      projectId,
    }),
  );
}

export function generateProjectCollaborationObject({
  userId,
  projectOwnerId,
  projectId,
  status = ProjectCollaborationStatusApi.ACTIVE,
}: GenerateProjectCollaborationOptions): ProjectCollaboration {
  return {
    id: generateId(),
    userId,
    context: {
      id: projectId,
      type: ContextTypeApi.PROJECT,
    },
    contextOwnerId: projectOwnerId,
    permissions: [
      ProjectCollaborationPermissionApi.CHAT,
      ProjectCollaborationPermissionApi.BID_AWARD,
    ],
    status,
  };
}

// --- Mixins for project state ---

export function awardAndChatCollaborator({
  userId,
  projectId,
  projectOwnerId,
}: GenerateProjectCollaborationOptions): Pick<
  GenerateProjectOptions,
  'projectCollaborations'
> {
  return {
    projectCollaborations: [
      generateProjectCollaborationObject({
        userId,
        projectOwnerId,
        projectId,
      }),
    ],
  };
}
