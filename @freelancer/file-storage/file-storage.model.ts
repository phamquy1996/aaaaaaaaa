/*
 * Files are stored in buckets. Eventually we'll have a single file storage
 * backend that supports multiple buckets for different purposes, but since we
 * can't architect reusable backend services currently each frontend bucket is
 * handled by a different backend endpoint/service.
 *
 * Once the miracle happens on the backend, all the new buckets defined here
 * should use the same backend service.
 */
export enum StorageBucket {
  // the user profile cover image
  PROFILE_COVER_IMAGES = 'profile_cover_images',
  // the "files" tab on the PVP
  FL_DRIVE = 'fl_drive',
  // the legacy project file storage before FlDrive, as we s*ck at migrations
  // also on the "files" tab on the PVP
  LEGACY_PROJECT_FILES = 'legacy_project_files',
  // the files initially posted with a project, arguably these should be stored
  // in the FlDrive bucket.
  // in the project description tab on the PVP
  LEGACY_PROJECT_ATTACHEMENTS = 'legacy_project_attachments',
  // the user profile pictures
  PROFILE_PICTURES = 'profile_pictures',
  // the files send through the chat (live chat or Inbox)
  MESSAGING_ATTACHEMENTS = 'messaging_attachements',
  // users portfolio items, displayed on "Discover" formely "Showcase" formely
  // "Thombstone" formely "Discover" formely "Showcase" formely..
  PORTFOLIO_ITEMS = 'portfolio_items',
  // the legacy contest file storage before FlDrive
  // used on CVP details tab
  LEGACY_CONTEST_ATTACHMENTS = 'legacy_contest_files',
  // files attached to a post when posting in group
  POST_ATTACHMENTS = 'post_files',
  GROUP_COVER_IMAGE = 'group_cover_image',
}

export type TaskState = 'running' | 'success' | 'error';

// File ids are auto-generated URL-safe random strings
export type FileId = string;

export interface FileReference {
  readonly bucket: StorageBucket;
  readonly id: FileId;
  readonly DEPREACTED_DO_NOT_USE_backendId?: number; // id as number :cry:
}

export type UploadTaskEvent = {
  readonly totalBytes: number; // Total number of bytes to upload
  readonly metadata: FullMetadata;
  readonly ref: FileReference;
  readonly bytesTransferred: number; // Number of bytes uploaded
} & (
  | {
      readonly state: 'running' | 'success';
      readonly downloadURL?: string;
    }
  | {
      readonly state: 'error';
      readonly error: {
        errorCode: string;
        requestId?: string;
      };
    }
);

export interface SettableMetadata {
  readonly cacheControl?: string;
  readonly contentDisposition?: string;
  readonly contentEncoding?: string;
  readonly contentLanguage?: string;
  readonly contentType?: string;
  // anything custom, e.g. cropping params for the image resize service to use
  readonly customMetadata?: {
    [key: string]: string;
  };
}

export interface FullMetadata extends SettableMetadata {
  readonly bucket: string;
  readonly id: string;
  readonly name: string; // the file name
  readonly size: number;
  readonly timeCreated: number; // milisecond unix timestamp
  readonly updated: number; // milisecond unix timestamp
}
