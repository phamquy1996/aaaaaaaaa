import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { ProjectCollaborationPermissionApi } from 'api-typings/projects/projects';
import {
  ProjectCollaborationAction,
  ProjectCollaborationPostRawPayload,
  ProjectCollaborationUpdatePayload,
} from './project-collaborations.backend-model';
import { ProjectCollaboration } from './project-collaborations.model';
import { ProjectCollaborationsCollection } from './project-collaborations.types';

export function projectCollaborationsBackend(): Backend<
  ProjectCollaborationsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      const projectId = getProjectIdQueryParamValue(query);
      if (!projectId || projectId.length === 0) {
        throw new Error(
          'Please provide a project id in order to query for project collaborations!',
        );
      }
      return {
        endpoint: `projects/0.1/projects/${projectId[0]}/collaborations`,
        isGaf: false,
        params: {},
      };
    },
    // Important: pass in the correct 'context' field to update the store
    push: (_, projectCollaboration) => {
      if (
        !projectCollaboration.extraForPush ||
        Object.values(projectCollaboration.extraForPush).length === 0
      ) {
        throw new Error(
          'Must provide either email or username to create collaboration!',
        );
      }
      if (!projectCollaboration.context) {
        throw new Error(
          'Must provide context field with correct projectId to PUSH! ',
        );
      }
      const projectId = projectCollaboration.context.id;
      const endpoint = `projects/0.1/projects/${projectId}/collaborations`;
      const asFormData = false;

      let payload: ProjectCollaborationPostRawPayload = {
        permissions: {
          chat: !!projectCollaboration.permissions.find(
            p => p === ProjectCollaborationPermissionApi.CHAT,
          ),
          bid_award: !!projectCollaboration.permissions.find(
            p => p === ProjectCollaborationPermissionApi.BID_AWARD,
          ),
        },
      };

      payload = {
        ...payload,
        ...projectCollaboration.extraForPush,
      };

      return {
        endpoint,
        asFormData,
        payload,
      };
    },
    set: undefined,
    update: (authUid, projectCollaboration, originalProjectCollaboration) => {
      if (!projectCollaboration.action) {
        throw new Error(
          'You must provide an action to update project collaboration!',
        );
      }
      if (!originalProjectCollaboration.context) {
        throw new Error('Context is missing for updating collaboration');
      }

      const projectId = originalProjectCollaboration.context.id;
      const method = 'PUT';
      const endpoint = `projects/0.1/projects/${projectId}/collaborations/${originalProjectCollaboration.id}`;

      let payload: ProjectCollaborationUpdatePayload = {
        action: projectCollaboration.action,
      };

      const { permissions } = projectCollaboration;

      // If action is update permission, require desired permission state
      if (
        projectCollaboration.action ===
        ProjectCollaborationAction.UPDATE_PERMISSIONS
      ) {
        if (permissions === undefined) {
          throw new Error(
            ' You must provide the expected permissions to update!',
          );
        }

        // Use desired permission array for update
        // If an item is not in the update request array, it will be false sent to PUT request
        payload = {
          action: payload.action,
          permissions: {
            chat: !!permissions.find(
              p => p === ProjectCollaborationPermissionApi.CHAT,
            ),
            bid_award: !!permissions.find(
              p => p === ProjectCollaborationPermissionApi.BID_AWARD,
            ),
          },
        };
      }

      return {
        endpoint,
        asFormData: false,
        method,
        payload,
      };
    },
    remove: undefined,
  };
}
function getProjectIdQueryParamValue(
  query?: RawQuery<ProjectCollaboration>,
): ReadonlyArray<number> {
  return getQueryParamValue(query, 'context', param =>
    param.condition === '==' || param.condition === 'equalsIgnoreCase'
      ? param.value && param.value.id
      : undefined,
  ).filter(isDefined);
}
