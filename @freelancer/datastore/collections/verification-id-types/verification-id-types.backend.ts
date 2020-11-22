import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { VerificationIdTypesCollection } from './verification-id-types.types';

export function verificationIdTypeBackend(): Backend<
  VerificationIdTypesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'verification/getIDTypes.php',
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
