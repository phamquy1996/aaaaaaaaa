import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  getQueryParamValue,
  mergeDocuments,
  mergeWebsocketDocuments,
  Path,
  pluckDocumentFromRawStoreCollectionState,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { DriveFileContext } from './drive-files.model';
import {
  transformDriveFiles,
  transformWebsocketDriveFile,
} from './drive-files.transformers';
import { DriveFilesCollection } from './drive-files.types';

export function driveFilesReducer(
  state: CollectionStateSlice<DriveFilesCollection> = {},
  action: CollectionActions<DriveFilesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'driveFiles') {
        const { result, ref, order } = action.payload;
        const context: DriveFileContext = {
          type: getQueryParamValue(ref.query, 'contextType')[0],
          id: getQueryParamValue(ref.query, 'contextId')[0],
        };

        return mergeDocuments<DriveFilesCollection>(
          state,
          transformIntoDocuments(
            result.drive_files,
            transformDriveFiles,
            context,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'driveFiles') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<DriveFilesCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'driveFiles') {
        const { delta, originalDocument, ref } = action.payload;

        return mergeWebsocketDocuments<DriveFilesCollection>(
          state,
          transformIntoDocuments([originalDocument.id.toString()], fileId => {
            const driveFile = pluckDocumentFromRawStoreCollectionState(
              state,
              ref.path,
              fileId,
            );
            if (!driveFile) {
              throw new Error('DriveFile being updated is missing.');
            }

            return deepSpread(driveFile, delta);
          }),
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const path: Path<DriveFilesCollection> = {
        collection: 'driveFiles',
        authUid: action.payload.toUserId,
      };
      const ref = { path };
      if (action.payload.parent_type !== 'notifications') {
        return state;
      }

      switch (action.payload.type) {
        case 'driveFileUpload': {
          return mergeWebsocketDocuments<DriveFilesCollection>(
            state,
            transformIntoDocuments(
              [action.payload],
              transformWebsocketDriveFile,
            ),
            ref,
          );
        }

        default:
          return state;
      }
    }

    default:
      return state;
  }
}
