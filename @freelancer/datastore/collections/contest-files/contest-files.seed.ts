import { generateId } from '@freelancer/datastore/testing';
import { ContestAttachmentFileType, ContestFile } from './contest-files.model';

export interface GenerateContestFileOptions {
  readonly contestId: number;
  readonly name?: string;
  readonly url?: string;
  readonly deleted?: boolean;
  readonly fileType?: ContestAttachmentFileType;
}

/**
 * Returns a contest file object. By default, this is a contest that is "Active".
 */
export function generateContestFileObject({
  contestId,
  name = 'Contest File',
  url = 'contest-file-url',
  deleted = false,
  fileType = ContestAttachmentFileType.IMAGE,
}: GenerateContestFileOptions): ContestFile {
  return {
    id: generateId(),
    contestId,
    name,
    url,
    deleted,
    fileType,
  };
}

// --- Mixins ---
