import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { DriveFileActionApi } from 'api-typings/drive/drive';
import {
  DriveFileUpdateActionRawPayload,
  DriveFileUpdateParams,
} from './drive-files.backend-model';
import { DriveFilesCollection } from './drive-files.types';

export function driveFilesBackend(): Backend<DriveFilesCollection> {
  return {
    defaultOrder: {
      field: 'timeCreated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'files/0.1/files/',
      params: {
        context_type: getQueryParamValue(query, 'contextType')[0],
        context_id: getQueryParamValue(query, 'contextId')[0],
        file_type: getQueryParamValue(query, 'fileType')[0],
        file_ids: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: (_, driveFile, originalDriveFile) => {
      const endpoint = `files/0.1/files/${originalDriveFile.id}`;
      const method = 'PUT';
      const params: DriveFileUpdateParams = {
        filename: driveFile.displayName,
        public_permission: driveFile.publicPermission,
      };

      const payload: DriveFileUpdateActionRawPayload = {
        action: DriveFileActionApi.UPDATE,
        drive_file: params,
      };

      return {
        method,
        endpoint,
        payload,
      };
    },
    remove: (_, driveFileId, originalDocument) => ({
      method: 'DELETE',
      endpoint: `files/0.1/files/${driveFileId}`,
      payload: {},
    }),
  };
}
