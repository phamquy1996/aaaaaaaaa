import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDriveFilePermissions } from './drive-file-permissions.transformers';
import { DriveFilePermissionsCollection } from './drive-file-permissions.types';

export function driveFilePermissionsReducer(
  state: CollectionStateSlice<DriveFilePermissionsCollection> = {},
  action: CollectionActions<DriveFilePermissionsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'driveFilePermissions') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<DriveFilePermissionsCollection>(
          state,
          transformIntoDocuments(
            result.permissions,
            transformDriveFilePermissions,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'driveFilePermissions') {
        const { ref, result } = action.payload;

        return mergeWebsocketDocuments<DriveFilePermissionsCollection>(
          state,
          transformIntoDocuments(
            result.permissions,
            transformDriveFilePermissions,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'driveFilePermissions') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<DriveFilePermissionsCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }

      return state;
    }

    default:
      return state;
  }
}
