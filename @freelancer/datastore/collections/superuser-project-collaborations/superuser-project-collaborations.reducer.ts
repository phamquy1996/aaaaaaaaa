import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { ProjectCollaborationPermissionApi } from 'api-typings/projects/projects';
import { transformProjectCollaboration } from '../project-collaborations/project-collaborations.transformers';
import { SuperuserProjectCollaborationsCollection } from './superuser-project-collaborations.types';

export function superuserProjectCollaborationsReducer(
  state: CollectionStateSlice<SuperuserProjectCollaborationsCollection> = {},
  action: CollectionActions<SuperuserProjectCollaborationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'superuserProjectCollaborations') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SuperuserProjectCollaborationsCollection>(
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
      if (action.payload.type === 'superuserProjectCollaborations') {
        const { result, ref, document: object } = action.payload;
        if (!object.extraForPush) {
          throw new Error(
            'Pass collaboration push fields to fit backend push function!',
          );
        }

        // In the datastore call, we only set chat and bid_award permission
        // milestone_view is always true in the backend
        return mergeWebsocketDocuments<
          SuperuserProjectCollaborationsCollection
        >(
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
    default:
      return state;
  }
}
