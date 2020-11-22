import { AttachmentFileApi } from 'api-typings/posts/posts';
import { AttachmentFile } from './post-files.model';

export function transformPostFile(
  attachmentFile: AttachmentFileApi,
): AttachmentFile {
  return {
    contentType: attachmentFile.content_type,
    created: attachmentFile.created,
    fileName: attachmentFile.file_name,
    fileSize: attachmentFile.file_size,
    id: attachmentFile.file_id,
    isTemp: attachmentFile.is_temp,
    s3Bucket: attachmentFile.s3_bucket,
    s3Obj: attachmentFile.s3_obj,
    updated: attachmentFile.updated,
    userId: attachmentFile.user_id,
  };
}
