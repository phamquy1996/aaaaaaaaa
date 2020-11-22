import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { ProjectCollaborationPermissionApi } from 'api-typings/projects/projects';
import { ProjectCollaborationAction } from './project-collaborations.backend-model';
import { transformProjectCollaboration } from './project-collaborations.transformers';
import { ProjectCollaborationsCollection } from './project-collaborations.types';

export function projectCollaborationsReducer(
  state: CollectionStateSlice<ProjectCollaborationsCollection> = {},
  action: CollectionActions<ProjectCollaborationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectCollaborations') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectCollaborationsCollection>(
          state,
          transformIntoDocuments(
            result.project_collaborations,
            transformProjectCollaboration,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'projectCollaborations') {
        const { result, ref, document: object } = action.payload;
        if (!object.extraForPush) {
          throw new Error(
            'Pass collaboration push fields to fit backend push function!',
          );
        }

        // In the datastore call, we only set chat and bid_award permission
        // milestone_view is always true in the backend
        return mergeWebsocketDocuments<ProjectCollaborationsCollection>(
          state,
          transformIntoDocuments(
            [
              {
                ...result,
                context: object.context,
                permissions: [
                  ProjectCollaborationPermissionApi.MILESTONE_VIEW,
                  ...object.permissions,
                ],
                obscured_email_address: object.extraForPush.email,
              },
            ],
            transformProjectCollaboration,
          ),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'projectCollaborations') {
        const { delta, originalDocument, ref } = action.payload;
        // Revoke action
        if (delta.action === ProjectCollaborationAction.REVOKE) {
          return removeDocumentById<ProjectCollaborationsCollection>(
            ref,
            state,
            originalDocument.id,
          );
        }

        // Update permissions
        return updateWebsocketDocuments<ProjectCollaborationsCollection>(
          state,
          [originalDocument.id],
          // Milesonte view permission is always true
          // We only need to update the desired permission array
          projectCollaboration => ({
            ...projectCollaboration,
            permissions: [
              ProjectCollaborationPermissionApi.MILESTONE_VIEW,
              ...((delta.permissions && delta.permissions.filter(isDefined)) ||
                []),
            ],
          }),
          ref,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      const ref: Reference<ProjectCollaborationsCollection> = {
        path: {
          collection: 'projectCollaborations',
          authUid: action.payload.toUserId,
        },
      };
      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'addProjectCollaborator': {
            return addWebsocketDocuments(
              state,
              [action.payload.data],
              transformProjectCollaboration,
              ref,
            );
          }

          case 'editProjectCollaboratorPermissions': {
            const collabData = action.payload.data;
            return updateWebsocketDocuments<ProjectCollaborationsCollection>(
              state,
              [collabData.id],
              collaboration => ({
                ...collaboration,
                permissions: collabData.permissions || [],
              }),
              ref,
            );
          }

          case 'revokeProjectCollaborator': {
            return removeDocumentById<ProjectCollaborationsCollection>(
              ref,
              state,
              action.payload.data.id,
            );
          }

          default:
            return state;
        }
      }
      return state;
    }
    default:
      return state;
  }
}
