import { EncodedUrl, EncodedUrlType } from './encoded-url.model';

export interface GenerateEncodedUrlOptions {
  readonly userId: number;
  readonly url: string;
  readonly type: EncodedUrlType;
}

export function generateEncodedUrlObject({
  userId,
  url,
  type,
}: GenerateEncodedUrlOptions): EncodedUrl {
  return {
    id: `${url}-${type}`,
    userId,
    inputUrl: url,
    url: encodeURIComponent(url),
    type,
  };
}
