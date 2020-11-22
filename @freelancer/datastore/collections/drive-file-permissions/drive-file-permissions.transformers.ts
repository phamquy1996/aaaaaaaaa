import { DriveFileContextPermissionApi } from 'api-typings/drive/drive';
import { DriveFilePermission } from './drive-file-permissions.model';

export function transformDriveFilePermissions(
  driveFilePermission: DriveFileContextPermissionApi,
): DriveFilePermission {
  return {
    id: driveFilePermission.id,
    contextId: driveFilePermission.context_id,
    contextType: driveFilePermission.context_type,
    permission: driveFilePermission.permission,
    active: driveFilePermission.active,
    fileId: driveFilePermission.drive_file_id,
  };
}
