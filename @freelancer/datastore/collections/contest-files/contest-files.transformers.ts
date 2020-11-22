import { ContestFileApi } from 'api-typings/contests/contests';
import {
  ContestAttachmentFileType,
  ContestFile,
  CONTEST_ATTACHMENT_IMAGE_FORMATS,
  CONTEST_ATTACHMENT_VIDEO_FORMATS,
} from './contest-files.model';

export function transformContestFile(file: ContestFileApi): ContestFile {
  if (!file.id || !file.contest_id || !file.name || !file.url) {
    throw new ReferenceError(`Missing a required contest file field.`);
  }

  // Since the filetype isn't stored on the backend for contest files, let's
  // just rely on filename extensions in identifying the filetypes for now. The
  // non-webapp CVP does the same and uses `pathinfo` on the backend to identify
  // the filetype.
  let fileType: ContestAttachmentFileType | undefined;
  let extension = file.name.split('.').pop();
  if (extension) {
    extension = extension.toLowerCase();

    if (CONTEST_ATTACHMENT_IMAGE_FORMATS.includes(extension)) {
      fileType = ContestAttachmentFileType.IMAGE;
    } else if (CONTEST_ATTACHMENT_VIDEO_FORMATS.includes(extension)) {
      fileType = ContestAttachmentFileType.VIDEO;
    }
  }

  return {
    id: file.id,
    contestId: file.contest_id,
    name: file.name,
    deleted: file.deleted || false,
    // The contest file urls do not start with https://
    // which is needed by fl-picture or fl-video when getting the src.
    // We prepend https:// here to properly load the resource.
    url: `https://${file.url}`,
    fileType,
  };
}
