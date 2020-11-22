import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { VerificationAddressDocumentTypesCollection } from './verification-address-document-types.types';

export function verificationAddressDocumentTypesBackend(): Backend<
  VerificationAddressDocumentTypesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'verification/getVerificationAddressDocumentTypes.php',
      isGaf: true,
      params: {
        countryCode: getQueryParamValue(query, 'countryCode')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
