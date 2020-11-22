import { AttachmentFileApi } from 'api-typings/posts/posts';
import {
  LegacyContestAttachmentsUploadResponseAjaxApi,
  LegacyProjectAttachementsUploadResponseAjaxApi,
  LegacyProjectFilesUploadResponseAjaxApi,
  PortfolioItemsUploadResponseAjaxApi,
} from './file-storage.backend-model';
import {
  FileReference,
  FullMetadata,
  StorageBucket,
} from './file-storage.model';

type StorageBackendConfig = {
  [bucket in StorageBucket]: (
    ref: FileReference,
  ) => {
    // the file upload endpoint pathname
    endpoint: string;
    // is the endpoint AJAX-API (GAF) or REST API
    isGaf?: boolean;
    // the name of the request param holding the uploaded file
    fileParam: string;
    // if supported by the storage backend, provide the endpoint to get the
    // file download URL
    downloadURLEndpoint?: string;
    // parse the downloadURL result & returns the download URL itself
    downloadURL?(result: BackendGetDownloadURLReturnTypes[bucket]): string;
    // [DEPRECATED] extra params attached to the request in addition to the
    // file & its metadata, because generic custom metadata are boring so let's
    // build a different backend file service for each variation of data we
    // have
    DEPRECATED_extraParams?(
      metadata: FullMetadata,
    ): {
      [key: string]: string;
    };
    // [DEPRECATED] parse the upload response and returns the MySQL row index
    // storing the file entry because why not (?!).
    // returns the pathname
    DEPREACTED_DO_NOT_USE_backendId?(
      result: BackendUploadReturnTypes[bucket],
    ): number;
    // [DEPRECATED] classic endpoints are boring so let's change the upload
    // endpoint URL based on some arbitrary data to make not no one will reuse
    // our backend muahahahah
    DEPRECATED_funkyChangingEndpoint?(metadata: FullMetadata): string;
  };
};

export type BackendUploadReturnTypes = {
  [StorageBucket.LEGACY_PROJECT_FILES]: LegacyProjectFilesUploadResponseAjaxApi;
  [StorageBucket.LEGACY_PROJECT_ATTACHEMENTS]: LegacyProjectAttachementsUploadResponseAjaxApi;
  [StorageBucket.PORTFOLIO_ITEMS]: PortfolioItemsUploadResponseAjaxApi;
  [StorageBucket.PROFILE_PICTURES]: {
    avatar_url: string;
  };
  [StorageBucket.LEGACY_CONTEST_ATTACHMENTS]: LegacyContestAttachmentsUploadResponseAjaxApi;
  [StorageBucket.POST_ATTACHMENTS]: {
    attachment_file: AttachmentFileApi;
  };
} & { readonly [k: string]: unknown };

export type BackendGetDownloadURLReturnTypes = {
  [StorageBucket.FL_DRIVE]: {
    readonly download_url: string;
  };
  [StorageBucket.PROFILE_PICTURES]: {
    avatar_url: string;
  };
  [StorageBucket.POST_ATTACHMENTS]: {
    url: string;
  };
} & { readonly [k: string]: unknown };

// This allows to configure the myriad of backend file storage services we have
// on a per-bucket basis, the goal being the long term all the buckets should
// use the
export const configs: StorageBackendConfig = {
  [StorageBucket.FL_DRIVE]: ref => ({
    endpoint: `files/0.1/files/${ref.id}`, // FIXME: probably wrong
    fileParam: 'files[]',
    downloadURLEndpoint: `files/0.1/files/${ref.id}/download?as_json=true`,
    downloadURL: result => result.download_url,
  }),
  [StorageBucket.LEGACY_PROJECT_FILES]: ref => ({
    endpoint: 'projects/upload.php',
    isGaf: true,
    fileParam: 'files[]',
    DEPRECATED_extraParams: metadata => {
      if (!metadata.customMetadata || !metadata.customMetadata.projectId) {
        throw new Error('Missing projectId in custom metadata');
      }
      return {
        'attachments[]': metadata.name,
        project_id: metadata.customMetadata.projectId,
        bid_id: metadata.customMetadata.bidId,
      };
    },
  }),
  [StorageBucket.LEGACY_PROJECT_ATTACHEMENTS]: () => ({
    endpoint: 'projects/uploadTemporaryFile.php',
    isGaf: true,
    fileParam: 'files[]',
    DEPREACTED_DO_NOT_USE_backendId: result => result.fileIds[0],
  }),
  [StorageBucket.PROFILE_PICTURES]: ref => ({
    endpoint: 'users/0.1/self/profile_picture/',
    fileParam: 'filedata',
    downloadURL: result => result.avatar_url,
    DEPRECATED_extraParams: metadata => {
      if (
        !metadata.customMetadata ||
        !metadata.customMetadata.x ||
        !metadata.customMetadata.y ||
        !metadata.customMetadata.cropW ||
        !metadata.customMetadata.cropH
      ) {
        throw new Error('missing x, y, cropW, or cropH custom metadata');
      }
      return {
        x: metadata.customMetadata.x,
        y: metadata.customMetadata.y,
        cropW: metadata.customMetadata.cropW,
        cropH: metadata.customMetadata.cropH,
        should_detect_face: metadata.customMetadata.shouldDetectFace ?? 'false',
      };
    },
  }),
  [StorageBucket.PROFILE_COVER_IMAGES]: ref => ({
    endpoint: 'users/0.1/self/cover_image/',
    fileParam: 'filedata',
    DEPRECATED_extraParams: metadata => {
      if (
        !metadata.customMetadata ||
        !metadata.customMetadata.x ||
        !metadata.customMetadata.y ||
        !metadata.customMetadata.crop_width ||
        !metadata.customMetadata.crop_height
      ) {
        throw new Error(
          'missing x, y, crop_width, or crop_height custom metadata',
        );
      }
      return {
        x: metadata.customMetadata.x,
        y: metadata.customMetadata.y,
        crop_width: metadata.customMetadata.crop_width,
        crop_height: metadata.customMetadata.crop_height,
      };
    },
  }),
  [StorageBucket.GROUP_COVER_IMAGE]: ref => ({
    DEPRECATED_funkyChangingEndpoint: metadata => {
      if (!metadata.customMetadata || !metadata.customMetadata.groupId) {
        throw new Error('missing groupId custom metadata');
      }
      return `groups/0.1/groups/${metadata.customMetadata.groupId}/cover_image/`;
    },
    endpoint: 'this_is_not_used',
    fileParam: 'filedata',
    DEPRECATED_extraParams: metadata => {
      if (
        !metadata.customMetadata ||
        !metadata.customMetadata.x ||
        !metadata.customMetadata.y ||
        !metadata.customMetadata.crop_width ||
        !metadata.customMetadata.crop_height
      ) {
        throw new Error(
          'missing x, y, crop_width, or crop_height custom metadata',
        );
      }
      return {
        x: metadata.customMetadata.x,
        y: metadata.customMetadata.y,
        crop_width: metadata.customMetadata.crop_width,
        crop_height: metadata.customMetadata.crop_height,
      };
    },
  }),
  [StorageBucket.MESSAGING_ATTACHEMENTS]: ref => ({
    endpoint: 'this_is_not_used',
    DEPRECATED_funkyChangingEndpoint: metadata => {
      if (!metadata.customMetadata || !metadata.customMetadata.threadId) {
        throw new Error('missing threadId custom metadata');
      }
      return `messages/0.1/threads/${metadata.customMetadata.threadId}/messages/`;
    },
    fileParam: 'files[]',
    DEPRECATED_extraParams: metadata => {
      if (
        !metadata.customMetadata ||
        !metadata.customMetadata.threadId ||
        !metadata.customMetadata.clientMessageId
      ) {
        throw new Error('missing threadId or clientMessageId custom metadata');
      }
      return {
        thread_id: metadata.customMetadata.threadId,
        client_message_id: metadata.customMetadata.clientMessageId,
      };
    },
  }),
  [StorageBucket.PORTFOLIO_ITEMS]: () => ({
    endpoint: `showcase/uploadFile.php`,
    fileParam: 'files[]',
    isGaf: true,
    DEPREACTED_DO_NOT_USE_backendId: result => result.id,
  }),
  [StorageBucket.LEGACY_CONTEST_ATTACHMENTS]: () => ({
    endpoint: 'contests/uploadTemporaryFile.php',
    isGaf: true,
    fileParam: 'files[]',
    DEPREACTED_DO_NOT_USE_backendId: result => result.file_ids[0],
  }),
  [StorageBucket.POST_ATTACHMENTS]: ref => ({
    endpoint: 'posts/0.1/files/',
    fileParam: 'file',
    downloadURLEndpoint: `posts/0.1/files/${ref.id}/download?view_inline=true`,
    downloadURL: result => result.url,
  }),
};
