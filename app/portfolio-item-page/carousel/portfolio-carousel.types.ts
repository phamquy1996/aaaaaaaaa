export enum CarouselScrollModes {
  NORMAL = 'normal',
  ONESIDEHALF = 'onesidehalf',
  BOTHSIDEHALF = 'bothsidehalf',
}

export interface ThumbnailFileItem {
  src: string | null | undefined;
  alt: string;
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
}
