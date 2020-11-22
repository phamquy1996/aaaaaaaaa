import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { transformProjectViewUsers } from './project-view-users.transformers';
import { ProjectViewUsersCollection } from './project-view-users.types';

export function projectViewUsersReducer(
  state: CollectionStateSlice<ProjectViewUsersCollection> = {},
  action: CollectionActions<ProjectViewUsersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectViewUsers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectViewUsersCollection>(
          state,
          transformIntoDocuments(result.users, transformProjectViewUsers),
          order,
          ref,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      const userId = action.payload.toUserId;
      if (action.payload.type === 'emailVerified') {
        return updateWebsocketDocuments<ProjectViewUsersCollection>(
          state,
          [userId],
          projectViewUser => ({
            ...projectViewUser,
            ...{
              status: {
                ...projectViewUser.status,
                ...{
                  emailVerified: true,
                },
              },
            },
          }),
          { path: { collection: 'projectViewUsers', authUid: userId } },
        );
      }
      return state;
    }
    default:
      return state;
  }
}
