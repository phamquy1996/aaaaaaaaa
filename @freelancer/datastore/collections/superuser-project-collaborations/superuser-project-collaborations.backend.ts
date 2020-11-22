import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { ProjectCollaborationPermissionApi } from 'api-typings/projects/projects';
import { ProjectCollaborationPostRawPayload } from '../project-collaborations/project-collaborations.backend-model';
import { ProjectCollaboration } from '../project-collaborations/project-collaborations.model';
import { SuperuserProjectCollaborationsCollection } from './superuser-project-collaborations.types';

export function superuserProjectCollaborationsBackend(): Backend<
  SuperuserProjectCollaborationsCollection
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
      const endpoint = `superuser/0.1/projects/${projectId}/collaborations`;
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
    update: undefined,
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
