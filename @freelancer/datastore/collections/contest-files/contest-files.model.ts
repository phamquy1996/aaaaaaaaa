/**
 * Files attached to a specified contest. Used and viewable on contest view page
 * details tab or `freelancer.com/contest/<contestId>/details`
 */
export interface ContestFile {
  readonly id: number;
  readonly contestId: number;
  readonly name: string;
  readonly url: string;
  readonly deleted: boolean;
  readonly fileType?: ContestAttachmentFileType;
}

/**
 * Supported file types for preview. Used in contest details tab file contest
 * entry file previews.
 */
export const CONTEST_ATTACHMENT_IMAGE_FORMATS: ReadonlyArray<string> = [
  'jpeg',
  'jpg',
  'png',
  'gif',
  'bmp',
];
export const CONTEST_ATTACHMENT_VIDEO_FORMATS: ReadonlyArray<string> = [
  'mp4',
  'webm',
  'ogg',
];

export enum ContestAttachmentFileType {
  IMAGE = 'image',
  VIDEO = 'video',
}
