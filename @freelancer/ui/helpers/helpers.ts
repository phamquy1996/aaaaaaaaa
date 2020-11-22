import {
  LinkTargetWhitelist,
  LINK_NEW_TAB_REGEXP_WHITELIST,
  LINK_NEW_TAB_WHITELIST,
  LINK_SAME_TAB_WHITELIST,
} from '../link/link-new-tab-whitelist';

/** Performs a deep comparison between two values to determine if they are equivalent.
 *
 * Signature same as lodash
 * @param value The value to compare.
 * @param other The other value to compare.
 * @returns Returns `true` if the values are equivalent, else `false`.
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((value, i) => isEqual(value, b[i]))
    );
  }

  if (a instanceof Date) {
    return b instanceof Date && a.getTime() === b.getTime();
  }

  if (a instanceof RegExp) {
    return b instanceof RegExp && a.toString() === b.toString();
  }

  if (a instanceof Object && b instanceof Object) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    return (
      keysA.length === keysB.length &&
      keysA.every(key => keysB.includes(key) && isEqual(a[key], b[key]))
    );
  }

  return false;
}

/**
 * Returns a name / value object for each item in an object.
 * Like `Object.entries` but it returns a mapped object instead of an array
 */
export function entriesMap<V>(e: {
  [k: string]: V;
}): {
  name: string;
  value: V;
}[] {
  return Object.entries(e).map(([name, value]) => ({ name, value }));
}

// File helpers

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  OTHERS = 'others',
}

export enum ImageFileType {
  BMP = 'bmp',
  GIF = 'gif',
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  SVG = 'svg+xml',
}

export enum VideoFileType {
  MOV = 'quicktime',
  MP3 = 'mp3',
  MP4 = 'mp4',
  OGG = 'ogg',
}

export enum DocumentFileType {
  DOC = 'msword',
  DOCX = 'vnd.openxmlformats-officedocument.wordprocessingml.document',
  PDF = 'pdf',
  RTF = 'rtf',
  TXT = 'plain',
}

/**
 * File type is based on the file extension in filename
 * @param filename Filename with file extension
 */
export function getFileType(filename: string): FileType {
  if (isImageFile(filename)) {
    return FileType.IMAGE;
  }

  if (isVideoFile(filename)) {
    return FileType.VIDEO;
  }

  return FileType.OTHERS;
}

export function isImageFile(filename: string): boolean {
  const fileExtension = getFileExtension(filename);

  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExtension);
}

export function isVideoFile(filename: string): boolean {
  const fileExtension = getFileExtension(filename);

  return ['mp4', 'mov', 'ogg', 'avi', 'flv'].includes(fileExtension);
}

export function isPlayableVideoFile(filename: string): boolean {
  const fileExtension = getFileExtension(filename);

  return ['mp4'].includes(fileExtension);
}

export function isAudioFile(filename: string): boolean {
  const fileExtension = getFileExtension(filename);

  return ['mp3'].includes(fileExtension);
}

export function getFileExtension(filename: string): string {
  if (!filename) {
    return '';
  }
  const lowerCaseFilename = filename.toLowerCase();

  return lowerCaseFilename.split('.').pop() || '';
}

function hasMatchedRegexp(pattern: string, regExpList: ReadonlyArray<RegExp>) {
  return regExpList.some(regExp => !!pattern.match(regExp));
}

export function isLinkWhitelisted(
  linkConfig: LinkTargetWhitelist,
  isExternalLink: boolean,
): boolean {
  const linkWhitelist = isExternalLink
    ? LINK_SAME_TAB_WHITELIST
    : LINK_NEW_TAB_WHITELIST;

  // Check internal link against whitelisted regex
  if (
    !isExternalLink &&
    hasMatchedRegexp(linkConfig.destination, LINK_NEW_TAB_REGEXP_WHITELIST)
  ) {
    return true;
  }

  const matches = linkWhitelist
    .filter(whitelistConfig =>
      linkConfig.destination.startsWith(whitelistConfig.destination),
    )
    .filter(
      whitelistConfig =>
        !whitelistConfig.source ||
        linkConfig.source?.startsWith(whitelistConfig.source),
    );

  return matches.length > 0;
}

export function trackByValue(_: number, v: string | number): string | number {
  return v;
}

export function trackById(_: number, item: any): string | number {
  return item.id;
}
