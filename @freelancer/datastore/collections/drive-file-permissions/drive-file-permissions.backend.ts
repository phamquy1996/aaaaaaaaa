import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { DriveFilePermissionsCollection } from './drive-file-permissions.types';

export function driveFilePermissionsBackend(): Backend<
  DriveFilePermissionsCollection
> {
  return {
    // FIXME: T50039 This endpoint doesn't appear to be ordered in the backend
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      const fileId = getQueryParamValue(query, 'fileId')[0];
      return {
        endpoint: `files/0.1/files/${fileId}/permissions/`,
        isGaf: false,
        params: {},
      };
    },
    push: (_, driveFilePermission, extra) => ({
      endpoint: `files/0.1/files/${driveFilePermission.fileId}/permissions/`,
      payload: {
        context_type: driveFilePermission.contextType,
        'context_ids[]': [driveFilePermission.contextId],
        permission: driveFilePermission.permission,
      },
    }),
    set: undefined,
    update: undefined,
    remove: (_, permissionId, originalDocument) => ({
      method: 'DELETE',
      endpoint: `files/0.1/permissions/${permissionId}`,
      payload: {},
    }),
  };
}
