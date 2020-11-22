import { EncodedUrlGetResultAjax } from './encoded-url.backend-model';
import { EncodedUrl } from './encoded-url.model';

export function transformEncodedUrl(
  encodedUrl: EncodedUrlGetResultAjax,
): EncodedUrl {
  return {
    id: `${encodedUrl.url}.${encodedUrl.type}`,
    userId: encodedUrl.userId,
    type: encodedUrl.type,
    inputUrl: encodedUrl.inputUrl ? encodedUrl.inputUrl : '',
    url: encodedUrl.url,
  };
}
