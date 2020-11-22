/**
 * Stores URLs encoded by GAF. Used on user profiles and for the Report Project
 * link on the PVP.
 *
 * TODO: Convert this to a service T148570
 */
export interface EncodedUrl {
  readonly id: string;
  readonly userId: number;
  readonly inputUrl: string;
  readonly type: EncodedUrlType;
  readonly url: string;
}

export enum EncodedUrlType {
  URL_SAFE_ENCODE = 'url-safe-encode',
  USER_PROFILE = 'user-profile',
}
