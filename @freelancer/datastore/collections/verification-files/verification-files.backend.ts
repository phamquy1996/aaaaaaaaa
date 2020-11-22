import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { VerificationFilesCollection } from './verification-files.types';

/**
 * This doesn't have the push method because making the VerificationFile instance is
 * tied to uploading the actual file, which happens through the fileservice module.
 */
export function verificationFilesBackend(): Backend<
  VerificationFilesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    // Prioritizes fetching by IDs, by VerificationRequest ID, then by file ID.
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'verification/getVerificationFile.php',
      isGaf: true,
      params: {
        ids,
        verificationRequestId: getQueryParamValue(
          query,
          'verificationRequestId',
        )[0],
        fileId: getQueryParamValue(query, 'fileId')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: (authUid, id, originalVerificationFile) => ({
      endpoint: 'verification/deleteVerificationFile.php',
      method: 'POST',
      isGaf: true,
      asFormData: true,
      payload: { verificationFileId: toNumber(id) },
    }),
  };
}
