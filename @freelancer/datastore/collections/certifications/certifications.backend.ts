import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { CertificationsCollection } from './certifications.types';

export function certificationsBackend(): Backend<CertificationsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      const userId = getQueryParamValue(query, 'userId')[0];
      if (userId) {
        return {
          endpoint: `users/0.1/users/${userId}/certifications/`,
          isGaf: false,
          params: {},
        };
      }
      throw new Error('Set `userId` on certifications query');
    },
    push: (authUid, document) => ({
      endpoint: `users/0.1/certifications`,
      payload: {
        certificate: document.certificate,
        organization: document.organization,
        description: document.description,
        awarded_date: document.awardedDate / 1000,
      },
    }),
    set: undefined,
    update: (authUid, delta, document) => ({
      endpoint: `users/0.1/certifications/${document.id}`,
      method: 'PUT',
      payload: {
        certification_id: document.id,
        certificate: delta.certificate,
        organization: delta.organization,
        description: delta.description,
        awarded_date: delta.awardedDate
          ? delta.awardedDate / 1000
          : document.awardedDate,
      },
    }),
    remove: (authUid, certificationId) => ({
      endpoint: `users/0.1/certifications/${certificationId}`,
      method: 'DELETE',
      payload: {
        certification_id: toNumber(certificationId),
      },
    }),
  };
}
