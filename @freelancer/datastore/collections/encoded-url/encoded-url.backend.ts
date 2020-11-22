import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { EncodedUrlType } from './encoded-url.model';
import { EncodedUrlCollection } from './encoded-url.types';

export function encodedUrlBackend(): Backend<EncodedUrlCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      const userId = getQueryParamValue(query, 'userId')[0];
      const type = getQueryParamValue(query, 'type')[0];
      const inputUrl = getQueryParamValue(query, 'inputUrl')[0];
      if (!userId) {
        throw new Error(
          '`userId` field is required on `encodedUrl` collection.',
        );
      }
      if (!type) {
        throw new Error('`type` field is required on `encodedUrl` collection.');
      }

      if (!inputUrl && type === EncodedUrlType.URL_SAFE_ENCODE) {
        throw new Error('`inputUrl` field is required for url-safe-encode.');
      }

      return {
        endpoint: 'encoded-urls/getEncodedUrl.php',
        isGaf: true,
        params: {
          userId,
          type,
          inputUrl,
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
