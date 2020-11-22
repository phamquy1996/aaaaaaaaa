import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSuperuserProjectViewUsers } from './superuser-project-view-users.transformers';
import { SuperuserProjectViewUsersCollection } from './superuser-project-view-users.types';

export function superuserProjectViewUsersReducer(
  state: CollectionStateSlice<SuperuserProjectViewUsersCollection> = {},
  action: CollectionActions<SuperuserProjectViewUsersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'superuserProjectViewUsers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SuperuserProjectViewUsersCollection>(
          state,
          transformIntoDocuments(
            result.users,
            transformSuperuserProjectViewUsers,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
