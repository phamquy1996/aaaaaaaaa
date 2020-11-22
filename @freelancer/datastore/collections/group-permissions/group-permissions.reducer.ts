import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformGroupPermissions } from './group-permissions.transformers';
import { GroupPermissionsCollection } from './group-permissions.types';

export function groupPermissionsReducer(
  state: CollectionStateSlice<GroupPermissionsCollection> = {},
  action: CollectionActions<GroupPermissionsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'groupPermissions') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<GroupPermissionsCollection>(
          state,
          transformIntoDocuments([result], transformGroupPermissions),
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
