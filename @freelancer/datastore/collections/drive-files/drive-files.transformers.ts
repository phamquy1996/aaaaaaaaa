import { WebsocketDriveFileUploadEvent } from '@freelancer/datastore/core';
import { DriveFileApi } from 'api-typings/drive/drive';
import { DriveFile, DriveFileContext } from './drive-files.model';

export function transformDriveFiles(
  driveFile: DriveFileApi,
  context: DriveFileContext,
): DriveFile {
  if (driveFile.id === undefined) {
    throw Error(`Drive file does not have id`);
  }

  if (driveFile.time_created === undefined) {
    throw Error(`Drive file does not have time_created attribute`);
  }

  if (driveFile.owner_id === undefined) {
    throw Error(`Drive file does not have owner_id attribute`);
  }

  if (driveFile.display_name === undefined) {
    throw Error(`Drive file does not have display_name attribute`);
  }

  return {
    contextId: context.id,
    contextType: context.type,
    deleted:
      driveFile.deleted_by && driveFile.time_deleted
        ? {
            by: driveFile.deleted_by,
            time: driveFile.time_deleted * 1000,
          }
        : undefined,
    displayName: driveFile.display_name,
    id: driveFile.id,
    fileSize: driveFile.file_size,
    fileType: driveFile.file_type,
    ownerId: driveFile.owner_id,
    publicPermission: driveFile.public_permission,
    timeCreated: driveFile.time_created * 1000,
    timeUpdated: driveFile.time_updated
      ? driveFile.time_updated * 1000
      : undefined,
    arrowDetails: driveFile.arrow_details
      ? {
          bomId: driveFile.arrow_details.bom_id,
        }
      : undefined,
  };
}

export function transformWebsocketDriveFile(
  event: WebsocketDriveFileUploadEvent,
): DriveFile {
  return {
    contextId: event.data.context.id,
    contextType: event.data.context.type,
    displayName: event.data.drive_file.display_name,
    id: event.data.drive_file.id,
    fileSize: event.data.drive_file.file_size,
    fileType: event.data.drive_file.file_type,
    ownerId: event.data.drive_file.owner_id,
    publicPermission: event.data.drive_file.public_permission,
    timeCreated: event.data.drive_file.time_created * 1000,
    timeUpdated: event.data.drive_file.time_updated
      ? event.data.drive_file.time_updated * 1000
      : undefined,
    arrowDetails: event.data.drive_file.arrow_details
      ? {
          bomId: event.data.drive_file.arrow_details.bom_id,
        }
      : undefined,
  };
}
